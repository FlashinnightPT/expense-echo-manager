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
    [RoutePrefix("users")]
    public class UsersController : ApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage GetUsers()
        {
            try
            {
                var users = new List<User>();
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM users";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                DateTime? lastLogin = null;
                                if (reader["last_login"] != DBNull.Value)
                                {
                                    lastLogin = Convert.ToDateTime(reader["last_login"]);
                                }
                                
                                users.Add(new User
                                {
                                    Id = reader["id"].ToString(),
                                    Name = reader["name"].ToString(),
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Status = reader["status"].ToString(),
                                    LastLogin = lastLogin
                                });
                            }
                        }
                    }
                }
                
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching users: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpGet]
        [Route("username/{username}")]
        public HttpResponseMessage GetUserByUsername(string username)
        {
            try
            {
                User user = null;
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM users WHERE username = @username";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@username", username);
                        
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
                            }
                        }
                    }
                }
                
                if (user != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, user);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "User not found");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user by username: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("")]
        public HttpResponseMessage CreateUser(User user)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"INSERT INTO users 
                         (id, name, username, password, role, status, last_login) 
                         VALUES (@id, @name, @username, @password, @role, @status, @last_login)";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", user.Id);
                        command.Parameters.AddWithValue("@name", user.Name);
                        command.Parameters.AddWithValue("@username", user.Username);
                        command.Parameters.AddWithValue("@password", user.Password);
                        command.Parameters.AddWithValue("@role", user.Role);
                        command.Parameters.AddWithValue("@status", user.Status);
                        command.Parameters.AddWithValue("@last_login", user.LastLogin as object ?? DBNull.Value);
                        
                        command.ExecuteNonQuery();
                    }
                    
                    // Get the newly created user
                    string querySql = "SELECT * FROM users WHERE id = @id";
                    User newUser = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", user.Id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                DateTime? lastLogin = null;
                                if (reader["last_login"] != DBNull.Value)
                                {
                                    lastLogin = Convert.ToDateTime(reader["last_login"]);
                                }

                                newUser = new User
                                {
                                    Id = reader["id"].ToString(),
                                    Name = reader["name"].ToString(),
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Status = reader["status"].ToString(),
                                    LastLogin = lastLogin
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.Created, newUser);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPut]
        [Route("{id}")]
        public HttpResponseMessage UpdateUser(string id, User user)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"UPDATE users 
                         SET name = @name, username = @username, role = @role, status = @status, last_login = @last_login 
                         WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@name", user.Name);
                        command.Parameters.AddWithValue("@username", user.Username);
                        command.Parameters.AddWithValue("@role", user.Role);
                        command.Parameters.AddWithValue("@status", user.Status);
                        command.Parameters.AddWithValue("@last_login", user.LastLogin as object ?? DBNull.Value);
                        command.Parameters.AddWithValue("@id", id);
                        
                        command.ExecuteNonQuery();
                    }
                    
                    // Update password if provided
                    if (!string.IsNullOrEmpty(user.Password))
                    {
                        string passwordSql = "UPDATE users SET password = @password WHERE id = @id";
                        
                        using (var command = new MySqlCommand(passwordSql, connection))
                        {
                            command.Parameters.AddWithValue("@password", user.Password);
                            command.Parameters.AddWithValue("@id", id);
                            
                            command.ExecuteNonQuery();
                        }
                    }
                    
                    // Get the updated user
                    string querySql = "SELECT * FROM users WHERE id = @id";
                    User updatedUser = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                DateTime? lastLogin = null;
                                if (reader["last_login"] != DBNull.Value)
                                {
                                    lastLogin = Convert.ToDateTime(reader["last_login"]);
                                }

                                updatedUser = new User
                                {
                                    Id = reader["id"].ToString(),
                                    Name = reader["name"].ToString(),
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Status = reader["status"].ToString(),
                                    LastLogin = lastLogin
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, updatedUser);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage DeleteUser(string id)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = "DELETE FROM users WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        command.ExecuteNonQuery();
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting user: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPut]
        [Route("{id}/last-login")]
        public HttpResponseMessage UpdateLastLogin(string id)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        command.ExecuteNonQuery();
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = true });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating last login: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
