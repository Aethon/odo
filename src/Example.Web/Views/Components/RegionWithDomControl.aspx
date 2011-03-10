<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Region with a DomControl
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>A region with a DomControl (by hand)</h2>

    <label for="halign">Horizontal alignment</label>
    <select id="halign">
        <option value="left">left</option>
        <option value="center">center</option>
        <option value="right">right</option>
        <option value="stretch">stretch</option>
    </select>

    <label for="valign">Vertical alignment</label>
    <select id="valign">
        <option value="left">top</option>
        <option value="center">center</option>
        <option value="right">bottom</option>
        <option value="stretch">stretch</option>
    </select>
    
    <p />
    <div id="RegionHost" style="border: 1px solid green; width: 300px; height: 300px; position: relative">
        <div id="Insider" style="background: blue" />
    </div>



    <script type="text/javascript">
        (function () {
            var $host = $("#RegionHost");
            var r = jspf.createRegion();
            r.host = $host[0];
            var layout = { width: 10, height: 10, horizontalAlignment: 'stretch', verticalAlignment: 'top' };
            var c = jspf.createDomControl(layout);
            c.dom = $("#Insider")[0];
            r.root = c;

            var update = function () {
                c.horizontalAlignment = $(halign).val();
                c.verticalAlignment = $(valign).val();
                r.layOut();
            };

            $("#valign").change(update);
            $("#halign").change(update);

            update();

        } ());
    </script>
</asp:Content>
