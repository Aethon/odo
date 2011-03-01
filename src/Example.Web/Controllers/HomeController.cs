using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Odo.Core;
using Odo.Core.Semantics;
using Odo.Mvc;

namespace Example.Web.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewData["Message"] = "Welcome to the Odo experimental application!";

            return View();
        }
    }
}
