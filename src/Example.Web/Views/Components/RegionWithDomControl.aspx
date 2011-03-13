<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Region with a DomControl
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>A region with a DomControl (by hand)</h2>

    <label for="halign">Horizontal alignment</label>
    <select id="halign">
        <option value="-1">left</option>
        <option value="2">center</option>
        <option value="1">right</option>
        <option value="0">stretch</option>
    </select>

    <label for="valign">Vertical alignment</label>
    <select id="valign">
        <option value="-1">top</option>
        <option value="2">center</option>
        <option value="1">bottom</option>
        <option value="0">stretch</option>
    </select>
    
    <p />
    <div id="RegionHost" style="border: 1px solid green; width: 300px; height: 300px; position: relative">
        
    </div>



    <script type="text/javascript">
        (function () {
            var $host = $("#RegionHost");
            var r = new Jspf.Region();
            r.host = $host[0];
            var c = new Jspf.DomControl();
            c.get_horizontal().length = 10;
            c.get_vertical().length = 10;
            c.set_domContent($("<div style='background: blue' />")[0]);
            r.set_child(c);

            var update = function () {
                c.get_horizontal().alignment = parseInt($(halign).val());
                c.get_vertical().alignment = parseInt($(valign).val());
                r.layOut();
            };

            $("#valign").change(update);
            $("#halign").change(update);

            update();

        } ());
    </script>
</asp:Content>
