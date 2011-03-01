<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<Example.Web.ViewModels.SelectorViewModel>" %>
<%@ Import Namespace="Example.Business" %>
<%@ Import Namespace="Odo.Mvc" %>
<%@ Import Namespace="Odo.Core.Design" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Selector
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <select id="ParallelSelect" multiple="multiple"></select>
    
    <h2>Selector</h2>
    
        <style type="text/css">

        *

        {

            font-family: Verdana;

            font-size: 8pt;
            vertical-align: top;
            
            

        }
        
        .ui-list
        {
	        list-style:none;
	        padding: 2px;
	        margin: 0;
	        display:block;
	        background: white;
	        border: 1px solid #CCC;
        }
        
        .ui-list-item 
        {
            margin:0;
	        padding: 0;
	        width: 100%;
	        border: 1px solid transparent;
        }
        
        .ui-text-box
        {
	        border: 1px solid #CCC;
        }

    </style>

    <%= this.Discuss(d =>
    d.Group(pctx => pctx,
        members: m =>
            m.Selector(pctx => pctx.FacilityTypes, b => b
                .Comparison((l, r) => string.Compare(l.Description, r.Description))
                .AvailableItemTemplate(DesignTemplate<FacilityType>.Create(e => e.Text(pctx => pctx, content: ft => ft.Description)))
                .Symbol(t => t.Key)
                .Mode(SelectorMode.Expert))
            .Selector(pctx => pctx.FacilityTypes, b => b
                .Comparison((l, r) => string.Compare(l.Description, r.Description))
                .AvailableItemTemplate(DesignTemplate<FacilityType>.Create(e => e.Text(pctx => pctx, content: ft => ft.Description)))
                .Symbol(t => t.Key)
                .Tip(t => "ha ha ha ha")
                .Mode(SelectorMode.FilteredUniqueReverseDiva)))
    )%>
</asp:Content>
