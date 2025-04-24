
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
    [RoutePrefix("transactions")]
    public class TransactionsController : ApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage GetTransactions()
        {
            try
            {
                var transactions = new List<Transaction>();
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    string sql = "SELECT * FROM transactions";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                DateTime date = Convert.ToDateTime(reader["date"]);
                                transactions.Add(new Transaction
                                {
                                    Id = reader["id"].ToString(),
                                    Date = date.ToString("dd-MM-yyyy HH:mm:ss"),
                                    Amount = Convert.ToDecimal(reader["amount"]),
                                    Description = reader["description"].ToString(),
                                    CategoryId = reader["categoryid"].ToString(),
                                    Type = reader["type"].ToString(),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                });
                            }
                        }
                    }
                }
                
                return Request.CreateResponse(HttpStatusCode.OK, transactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching transactions: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("")]
        public HttpResponseMessage CreateTransaction(Transaction transaction)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"INSERT INTO transactions 
                         (id, date, amount, description, categoryid, type) 
                         VALUES (@id, @date, @amount, @description, @categoryid, @type)";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", transaction.Id);
                        command.Parameters.AddWithValue("@date", transaction.Date);
                        command.Parameters.AddWithValue("@amount", transaction.Amount);
                        command.Parameters.AddWithValue("@description", transaction.Description);
                        command.Parameters.AddWithValue("@categoryid", transaction.CategoryId);
                        command.Parameters.AddWithValue("@type", transaction.Type);
                        
                        command.ExecuteNonQuery();
                    }
                    
                    // Get the newly created transaction
                    string querySql = "SELECT * FROM transactions WHERE id = @id";
                    Transaction newTransaction = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", transaction.Id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                DateTime date = Convert.ToDateTime(reader["date"]);
                                newTransaction = new Transaction
                                {
                                    Id = reader["id"].ToString(),
                                    Date = date.ToString("dd-MM-yyyy HH:mm:ss"),
                                    Amount = Convert.ToDecimal(reader["amount"]),
                                    Description = reader["description"].ToString(),
                                    CategoryId = reader["categoryid"].ToString(),
                                    Type = reader["type"].ToString(),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.Created, newTransaction);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating transaction: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpPut]
        [Route("{id}")]
        public HttpResponseMessage UpdateTransaction(string id, Transaction transaction)
        {
            try
            {
                // Ensure the ID in the URL matches the transaction ID
                if (id != transaction.Id)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Transaction ID mismatch");
                }
                
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = @"UPDATE transactions 
                                  SET date = @date, 
                                      amount = @amount, 
                                      description = @description, 
                                      categoryid = @categoryid, 
                                      type = @type
                                  WHERE id = @id";
                    
                    using (var command = new MySqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", transaction.Id);
                        command.Parameters.AddWithValue("@date", transaction.Date);
                        command.Parameters.AddWithValue("@amount", transaction.Amount);
                        command.Parameters.AddWithValue("@description", transaction.Description);
                        command.Parameters.AddWithValue("@categoryid", transaction.CategoryId);
                        command.Parameters.AddWithValue("@type", transaction.Type);
                        
                        int rowsAffected = command.ExecuteNonQuery();
                        
                        if (rowsAffected == 0)
                        {
                            return Request.CreateErrorResponse(
                                HttpStatusCode.NotFound, 
                                $"Transaction with ID {id} not found"
                            );
                        }
                    }
                    
                    // Get the updated transaction
                    string querySql = "SELECT * FROM transactions WHERE id = @id";
                    Transaction updatedTransaction = null;
                    
                    using (var command = new MySqlCommand(querySql, connection))
                    {
                        command.Parameters.AddWithValue("@id", transaction.Id);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                DateTime date = Convert.ToDateTime(reader["date"]);
                                updatedTransaction = new Transaction
                                {
                                    Id = reader["id"].ToString(),
                                    Date = date.ToString("dd-MM-yyyy HH:mm:ss"),
                                    Amount = Convert.ToDecimal(reader["amount"]),
                                    Description = reader["description"].ToString(),
                                    CategoryId = reader["categoryid"].ToString(),
                                    Type = reader["type"].ToString(),
                                    CreatedAt = reader["createdat"] != DBNull.Value ? Convert.ToDateTime(reader["createdat"]) : DateTime.MinValue
                                };
                            }
                        }
                    }
                    
                    return Request.CreateResponse(HttpStatusCode.OK, updatedTransaction);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating transaction: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        
        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage DeleteTransaction(string id)
        {
            try
            {
                using (var connection = DbConnection.GetConnection())
                {
                    connection.Open();
                    
                    string sql = "DELETE FROM transactions WHERE id = @id";
                    
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
                Console.WriteLine($"Error deleting transaction: {ex.Message}");
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
