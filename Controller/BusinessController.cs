using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SchoolUI.Web.Controller
{
    public class Test
    {
        public int ID { get; set; } = new Random(10000).Next();
        public DateTime DateStart { get; set; } = DateTime.Now;
        public DateTime DateEnd { get; set; } = DateTime.Now;
        public string Title { get; set; } = "تست";

    }
    public class BusinessController : ApiController
    {

        public dynamic Get()
        {
            var list = new List<Test>();
            for (int i = 0; i < 100; i++)
            {
                list.Add(new Test());
            }
            return list;
        }
    }
}
