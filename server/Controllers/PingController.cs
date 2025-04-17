
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace expense_echo_manager_api.Controllers
{
    [RoutePrefix("ping")]
    public class PingController : ApiController
    {
        [HttpOptions]
        [Route("")]
        public IHttpActionResult Options()
        {
            return Ok();
        }

        [HttpGet]
        [Route("")]
        public HttpResponseMessage Ping()
        {
            /*
            var response = Request.CreateResponse(HttpStatusCode.OK, new { message = "Server is running" });
            response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:8081");
            return response;
            */

            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Server is running" });

        }
    }
}
