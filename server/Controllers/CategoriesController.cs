
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using expense_echo_manager_api.Database;
using expense_echo_manager_api.Models;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace expense_echo_manager_api.Controllers
{
    [RoutePrefix("categories")]
    public class CategoriesController : ApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage GetCategories()
        {
            try
            {
                var categories = new List<Category>();
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM categories";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                categories.Add(new Category
                                {
                                    Id = reader["id"].ToString(),
                                    Type = reader["type"].ToString(),
                                    Name = reader["name"].ToString(),
                                    ParentId = reader["parentid"] as string,
                                    Level = Convert.ToInt32(reader["level"]),
                                    IsFixedExpense = Convert.ToBoolean(reader["isfixedexpense"]),
                                    IsActive = Convert.ToBoolean(reader["isactive"]),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                });
                            }
                        }
                    }
                }
                
                return Request.CreateResponse(HttpStatusCode.OK, categories);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching categories: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("")]
        public HttpResponseMessage CreateCategory(Category category)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"INSERT INTO categories 
                        (id, type, name, parentid, level, isfixedexpense, isactive) 
                        VALUES (@id, @type, @name, @parentid, @level, @isfixedexpense, @isactive)";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", category.Id);
                        command.Parameters.AddWithValue("@type", category.Type);
                        command.Parameters.AddWithValue("@name", category.Name);
                        command.Parameters.AddWithValue("@parentid", category.ParentId as object ?? DBNull.Value);
                        command.Parameters.AddWithValue("@level", category.Level);
                        command.Parameters.AddWithValue("@isfixedexpense", category.IsFixedExpense);
                        command.Parameters.AddWithValue("@isactive", category.IsActive);
                        
                        command.ExecuteNonQuery();
                    }
                    
                    // Get the newly created category
                    string querySql = "SELECT * FROM categories WHERE id = @id";
                    Category newCategory = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", category.Id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                newCategory = new Category
                                {
                                    Id = reader["id"].ToString(),
                                    Type = reader["type"].ToString(),
                                    Name = reader["name"].ToString(),
                                    ParentId = reader["parentid"] as string,
                                    Level = Convert.ToInt32(reader["level"]),
                                    IsFixedExpense = Convert.ToBoolean(reader["isfixedexpense"]),
                                    IsActive = Convert.ToBoolean(reader["isactive"]),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.Created, newCategory);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating category: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPut]
        [Route("{id}")]
        public HttpResponseMessage UpdateCategory(string id, Category category)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"UPDATE categories 
                        SET name = @name, type = @type, level = @level, parentid = @parentid, 
                            isfixedexpense = @isfixedexpense, isactive = @isactive 
                        WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@name", category.Name);
                        command.Parameters.AddWithValue("@type", category.Type);
                        command.Parameters.AddWithValue("@level", category.Level);
                        command.Parameters.AddWithValue("@parentid", category.ParentId as object ?? DBNull.Value);
                        command.Parameters.AddWithValue("@isfixedexpense", category.IsFixedExpense);
                        command.Parameters.AddWithValue("@isactive", category.IsActive);
                        command.Parameters.AddWithValue("@id", id);
                        
                        command.ExecuteNonQuery();
                    }
                    
                    // Get the updated category
                    string querySql = "SELECT * FROM categories WHERE id = @id";
                    Category updatedCategory = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                updatedCategory = new Category
                                {
                                    Id = reader["id"].ToString(),
                                    Type = reader["type"].ToString(),
                                    Name = reader["name"].ToString(),
                                    ParentId = reader["parentid"] as string,
                                    Level = Convert.ToInt32(reader["level"]),
                                    IsFixedExpense = Convert.ToBoolean(reader["isfixedexpense"]),
                                    IsActive = Convert.ToBoolean(reader["isactive"]),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, updatedCategory);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating category: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage DeleteCategory(string id)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = "DELETE FROM categories WHERE id = @id";
                    
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
                Console.WriteLine($"Error deleting category: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpDelete]
        [Route("clear/non-root")]
        public HttpResponseMessage ClearNonRootCategories()
        {
            try
            {
                int affectedRows = 0;
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = "DELETE FROM categories WHERE level > 1";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        affectedRows = command.ExecuteNonQuery();
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = true, affectedRows = affectedRows });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing non-root categories: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
