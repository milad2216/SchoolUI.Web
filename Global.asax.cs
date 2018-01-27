using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SchoolUI.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
         
        }

        private const string ROOT_DOCUMENT = "~/app/index.html";

        protected void Application_BeginRequest()
        {
            string url = Request.Url.LocalPath;
            if (url.Contains("api"))
                return;
            if (url.ToLower() == "/rd")
                return;
            if (url.ToLower().Contains("routedebugger"))
                return;
            if (url.ToLower().Contains("reportgenerator"))
                return;

            if (!System.IO.File.Exists(Context.Server.MapPath(url)))
                Context.RewritePath(ROOT_DOCUMENT);
        }
    }
}
