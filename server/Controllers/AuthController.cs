using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using expense_echo_manager_api.Database;
using expense_echo_manager_api.Models;
using MySql.Data.MySqlClient;

namespace expense_echo_manager_api.Controllers
{
    [RoutePrefix("auth")]
    public class AuthController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Username and password are required");
                }
                
                Console.WriteLine($"Login attempt for user: {request.Username}");
                
                // Find the user in the database
                User user = null;
                bool isFirstLogin = false;
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM users WHERE username = @username";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@username", request.Username);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                DateTime? lastLogin = null;
                                if (reader["last_login"] != DBNull.Value)
                                {
                                    lastLogin = Convert.ToDateTime(reader["last_login"]);
                                }
                                
                                user = new User
                                {
                                    Id = reader["id"].ToString(),
                                    Name = reader["name"].ToString(),
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Status = reader["status"].ToString(),
                                    LastLogin = lastLogin
                                };
                                
                                // Check if this appears to be a first login (temporary password or never logged in)
                                if (user.Password == "temp123" || (user.Status == "new" && lastLogin == null))
                                {
                                    isFirstLogin = true;
                                }
                            }
                        }
                    }
                }
                
                if (user == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "User not found");
                }
                
                // For first login, we accept the temporary password
                if (isFirstLogin && request.Password == "temp123")
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new 
                    { 
                        success = false, 
                        firstLogin = true,
                        message = "Please change your password"
                    });
                }
                
                // Special case for admin with default password
                bool isAdminWithDefaultPassword = user.Username == "admin" && request.Password == "admin123";
                
                // Validate password (comparing stored password with provided password)
                if (user.Password != request.Password && !isAdminWithDefaultPassword)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid credentials");
                }
                
                // Update last login time
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", user.Id);
                        command.ExecuteNonQuery();
                    }
                }
                
                // Clear password before returning
                user.Password = null;
                
                return Request.CreateResponse(HttpStatusCode.OK, new 
                { 
                    success = true, 
                    user = new 
                    {
                        id = user.Id,
                        name = user.Name,
                        username = user.Username,
                        role = user.Role
                    },
                    message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "An error occurred during login");
            }
        }
        
        [HttpPost]
        [Route("change-password")]
        public HttpResponseMessage ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Username) || 
                    string.IsNullOrEmpty(request.OldPassword) || 
                    string.IsNullOrEmpty(request.NewPassword))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Todos os campos são obrigatórios");
                }
                
                Console.WriteLine($"Alteração de senha para utilizador: {request.Username}");
                
                // Validar requisitos de senha
                var validationResult = ValidatePassword(request.NewPassword);
                if (!validationResult.IsValid)
                {
                    return Request.CreateErrorResponse(
                        HttpStatusCode.BadRequest, 
                        $"A senha não atende aos requisitos: {string.Join(", ", validationResult.Errors)}"
                    );
                }
                
                // Verificar utilizador e senha antiga
                User user = null;
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM users WHERE username = @username";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@username", request.Username);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                user = new User
                                {
                                    Id = reader["id"].ToString(),
                                    Name = reader["name"].ToString(),
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Status = reader["status"].ToString()
                                };
                            }
                        }
                    }
                }
                
                if (user == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Utilizador não encontrado");
                }
                
                // Verificar senha atual
                if (user.Password != request.OldPassword)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Senha atual incorreta");
                }
                
                // Atualizar senha do utilizador
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "UPDATE users SET password = @password, status = 'active' WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@password", request.NewPassword);
                        command.Parameters.AddWithValue("@id", user.Id);
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Falha ao atualizar senha");
                        }
                    }
                }
                
                return Request.CreateResponse(HttpStatusCode.OK, new 
                { 
                    success = true,
                    message = "Senha alterada com sucesso"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na alteração de senha: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Ocorreu um erro durante a alteração da senha");
            }
        }
        
        private PasswordValidationResult ValidatePassword(string password)
        {
            var errors = new List<string>();
            var result = new PasswordValidationResult();
            
            // Verificar comprimento mínimo
            if (password.Length < 8)
            {
                errors.Add("A senha deve ter pelo menos 8 caracteres");
            }
            
            // Verificar número mínimo de letras
            int letterCount = 0;
            foreach (char c in password)
            {
                if (char.IsLetter(c))
                {
                    letterCount++;
                }
            }
            if (letterCount < 2)
            {
                errors.Add("A senha deve ter pelo menos duas letras");
            }
            
            // Verificar presença de letra maiúscula
            if (!password.Any(char.IsUpper))
            {
                errors.Add("A senha deve ter pelo menos uma letra maiúscula");
            }
            
            // Verificar presença de letra minúscula
            if (!password.Any(char.IsLower))
            {
                errors.Add("A senha deve ter pelo menos uma letra minúscula");
            }
            
            // Verificar número mínimo de dígitos
            int digitCount = 0;
            foreach (char c in password)
            {
                if (char.IsDigit(c))
                {
                    digitCount++;
                }
            }
            if (digitCount < 2)
            {
                errors.Add("A senha deve ter pelo menos dois números");
            }
            
            // Verificar presença de caracteres especiais
            if (!password.Any(c => "!€@.*".Contains(c)))
            {
                errors.Add("A senha deve ter pelo menos um caractere especial (!,€,@,.,*)");
            }
            
            result.IsValid = errors.Count == 0;
            result.Errors = errors;
            
            return result;
        }
    }
    
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    
    public class ChangePasswordRequest
    {
        public string Username { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
    
    public class PasswordValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
