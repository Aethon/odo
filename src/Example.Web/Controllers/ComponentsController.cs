using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Example.Web.ViewModels;
using Odo.Mvc;

namespace Example.Web.Controllers
{
    [UsesOdo]
    public class ComponentsController : Controller
    {
        //
        // GET: /Components/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult RegionWithDomControl()
        {
            return View();
        }

        public ActionResult VirtualizingStackPanel()
        {
            return View();
        }

        public ActionResult Selector()
        {
            return View(new SelectorViewModel());
        }
    }
}
