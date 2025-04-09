
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
    }
    
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
