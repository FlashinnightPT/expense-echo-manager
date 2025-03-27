
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GFIN.API.Database;

namespace GFIN.API.Controllers
{
    [RoutePrefix("api/db-test")]
    public class DbTestController : ApiController
    {
        [HttpPost]
        [Route("")]
        public HttpResponseMessage TestDatabaseConnection()
        {
            bool isConnected = DbConnection.TestConnection();
            
            if (isConnected)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { success = true });
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new { success = false, error = "Database connection failed" });
            }
        }
    }
}
