<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Components</h2>
    <ul id="menu">              
        <li><%: Html.ActionLink("Region with a DomControl", "RegionWithDomControl", "Components")%></li>
        <li><%: Html.ActionLink("Virtualizing Stack Panel", "VirtualizingStackPanel", "Components")%></li>
        <li><%: Html.ActionLink("Selector", "Selector", "Components")%></li>
    </ul>
</asp:Content>
