<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	VirtualizingStackPanel
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>VirtualizingStackPanel</h2>

    <div id="RegionHost" style="border: 1px solid green; width: 300px; height: 300px; position: relative; float: left; margin:10px">

    </div>

    <div id="oldlist" style="float: left; border: 1px solid purple; width: 300px; height: 300px; margin:10px; position: relative" tabIndex="0">
    </div>

    <div id="newlist" style="float: left; border: 1px solid purple; width: 300px; height: 300px; margin:10px; position: relative;" tabIndex="0">
    </div>

    <br style="clear: both" />
    <button id="killsome" type="button">Kill some</button>

    <script type="text/javascript">
        (function () {
            /*
            var $host = $("#RegionHost");
            var r = new Jspf.Region();
            r.host = $host[0];
            var c = new Jspf.ListBox();
            r.set_child(c);
            r.layOut();
            */
            var items = ko.observableArray([]);
            var selected = ko.observableArray([]);

            for (var i = 1; i < 100; i++) {
                items().push(i);
            }

            $("#newlist").listbox({ source: items,
                selection: selected,
                comparefn: function (l, r) { return l - r; },
                template: function (i) { return $("<div>" + i + "</div>")[0]; }
            });
           
            $("#killsome").click(function () { items.splice(10, 1); });
        } ());
    </script>
</asp:Content>
