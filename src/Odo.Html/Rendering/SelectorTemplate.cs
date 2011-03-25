﻿// ------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version: 10.0.0.0
//  
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
// ------------------------------------------------------------------------------
namespace Odo.Html.Rendering
{
    using Odo.Core.Design;
    using System;
    
    
    #line 1 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.TextTemplating", "10.0.0.0")]
    public partial class SelectorTemplate : SelectorTemplateBase
    {
        #region ToString Helpers
        /// <summary>
        /// Utility class to produce culture-oriented representation of an object as a string.
        /// </summary>
        public class ToStringInstanceHelper
        {
            private System.IFormatProvider formatProviderField  = global::System.Globalization.CultureInfo.InvariantCulture;
            /// <summary>
            /// Gets or sets format provider to be used by ToStringWithCulture method.
            /// </summary>
            public System.IFormatProvider FormatProvider
            {
                get
                {
                    return this.formatProviderField ;
                }
                set
                {
                    if ((value != null))
                    {
                        this.formatProviderField  = value;
                    }
                }
            }
            /// <summary>
            /// This is called from the compile/run appdomain to convert objects within an expression block to a string
            /// </summary>
            public string ToStringWithCulture(object objectToConvert)
            {
                if ((objectToConvert == null))
                {
                    throw new global::System.ArgumentNullException("objectToConvert");
                }
                System.Type t = objectToConvert.GetType();
                System.Reflection.MethodInfo method = t.GetMethod("ToString", new System.Type[] {
                            typeof(System.IFormatProvider)});
                if ((method == null))
                {
                    return objectToConvert.ToString();
                }
                else
                {
                    return ((string)(method.Invoke(objectToConvert, new object[] {
                                this.formatProviderField })));
                }
            }
        }
        private ToStringInstanceHelper toStringHelperField = new ToStringInstanceHelper();
        public ToStringInstanceHelper ToStringHelper
        {
            get
            {
                return this.toStringHelperField;
            }
        }
        #endregion
        public virtual string TransformText()
        {
            this.GenerationEnvironment = null;
            this.Write("\r\nfunction (svm) {\r\n");
            
            #line 7 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CategoryFilter) { 
            
            #line default
            #line hidden
            this.Write("\tsvm._reportCategories = ko.observableArray((");
            
            #line 8 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Categories));
            
            #line default
            #line hidden
            this.Write(")(svm)());\r\n\tsvm._reportFields = ko.observableArray((");
            
            #line 9 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.From));
            
            #line default
            #line hidden
            this.Write(")(svm)());\r\n\tvar filter = odo.categorizedItemsView(svm._reportFields, svm._report" +
                    "Categories, (");
            
            #line 10 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Category));
            
            #line default
            #line hidden
            this.Write(")(svm), ");
            
            #line 10 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.GetCategoryKey));
            
            #line default
            #line hidden
            this.Write(" , ");
            
            #line 10 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.GetItemCategories));
            
            #line default
            #line hidden
            this.Write(", ");
            
            #line 10 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.CompareCategories));
            
            #line default
            #line hidden
            this.Write(", ");
            
            #line 10 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Comparison));
            
            #line default
            #line hidden
            this.Write(");\r\n");
            
            #line 11 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\tvar vm = odo.createSelectorViewModel(\r\n\t");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CategoryFilter) { 
            
            #line default
            #line hidden
            this.Write("filter.items");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 }else{ 
            
            #line default
            #line hidden
            this.Write("(");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.From));
            
            #line default
            #line hidden
            this.Write(")(svm)");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write(", (");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Current));
            
            #line default
            #line hidden
            this.Write(")(svm), ");
            
            #line 13 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Comparison));
            
            #line default
            #line hidden
            this.Write(",\r\n\t\t");
            
            #line 14 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Selector.Mode == SelectorMode.FilteredUniqueReverseDiva ? "true" : "false"));
            
            #line default
            #line hidden
            this.Write(");\r\n\t");
            
            #line 15 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CategoryFilter) { 
            
            #line default
            #line hidden
            this.Write("\t\tvm._divaFilter = filter;\r\n\t\t");
            
            #line 17 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t");
            
            #line 18 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.Selector.Mode == SelectorMode.FilteredUniqueReverseDiva) { 
            
            #line default
            #line hidden
            this.Write("\t\t\tvar dom = odo.html.createListComposerDom(vm,\r\n\t\t");
            
            #line 20 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } else { 
            
            #line default
            #line hidden
            this.Write("\t\t\tvar dom = odo.html.createSelectorDom(vm,\r\n\t\t");
            
            #line 22 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t{ mode: \'");
            
            #line 23 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Selector.Mode.ToString()));
            
            #line default
            #line hidden
            this.Write("\',\r\n\t\t  compare: ");
            
            #line 24 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Comparison));
            
            #line default
            #line hidden
            this.Write("\r\n\t\t\t");
            
            #line 25 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.AvailableTemplateScript != null) { 
            
            #line default
            #line hidden
            this.Write(", availableTemplate: ");
            
            #line 25 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.AvailableTemplateScript));
            
            #line default
            #line hidden
            
            #line 25 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t\t");
            
            #line 26 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.SelectedTemplateScript != null)  { 
            
            #line default
            #line hidden
            this.Write(", selectedTemplate: ");
            
            #line 26 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.SelectedTemplateScript));
            
            #line default
            #line hidden
            
            #line 26 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t\t");
            
            #line 27 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.Symbol != null) { 
            
            #line default
            #line hidden
            this.Write(", symbol: ");
            
            #line 27 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Symbol));
            
            #line default
            #line hidden
            this.Write(" ");
            
            #line 27 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t\t");
            
            #line 28 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.Tip != null) { 
            
            #line default
            #line hidden
            this.Write(", tip: ");
            
            #line 28 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Tip));
            
            #line default
            #line hidden
            this.Write(" ");
            
            #line 28 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t\t");
            
            #line 29 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CaptureId != null) { 
            
            #line default
            #line hidden
            this.Write(", captureId: \'");
            
            #line 29 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.CaptureId));
            
            #line default
            #line hidden
            this.Write("\' ");
            
            #line 29 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t\t\t");
            
            #line 30 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CaptureKeyScript != null) { 
            
            #line default
            #line hidden
            this.Write(", captureKey: ");
            
            #line 30 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.CaptureKeyScript));
            
            #line default
            #line hidden
            this.Write(" ");
            
            #line 30 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\t} );\r\n\tsvm._selectedReportFields = vm.selectedItems;\r\n\t");
            
            #line 33 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 if (Data.CategoryFilter) { 
            
            #line default
            #line hidden
            this.Write("        var _respondToFilter = function () {\r\n\t\t\tvar code = $(\"[local-id=\'filterd" +
                    "rop\']\", dom).val();\r\n            $.each(filter.categories(), function () {\r\n    " +
                    "            if (code === this.Code) {\r\n\t\t\t\t\tvar sel = this;\r\n\t\t\t\t\tsetTimeout(fun" +
                    "ction() { (");
            
            #line 39 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
            this.Write(this.ToStringHelper.ToStringWithCulture(Data.Category));
            
            #line default
            #line hidden
            this.Write(@")(svm)([sel]); }, 10);
					return false;
				}
            });
        };
		filter.categories.subscribe(_respondToFilter);
		svm._reportCategories.subscribe(_respondToFilter);
		$(""[local-id='filterdrop']"", dom).change(_respondToFilter);
		$(""[local-id='filterPlace']"", dom).show();
		$(function () { _respondToFilter(); });
		");
            
            #line 49 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"
 } 
            
            #line default
            #line hidden
            this.Write("\treturn dom;\r\n}\r\n");
            return this.GenerationEnvironment.ToString();
        }
        
        #line 1 "C:\Projects\Odo\src\Odo.Html\Rendering\SelectorTemplate.tt"

private global::Odo.Html.Rendering.SelectorRenderData _DataField;

/// <summary>
/// Access the Data parameter of the template.
/// </summary>
private global::Odo.Html.Rendering.SelectorRenderData Data
{
    get
    {
        return this._DataField;
    }
}


public virtual void Initialize()
{
    if ((this.Errors.HasErrors == false))
    {
bool DataValueAcquired = false;
if (this.Session.ContainsKey("Data"))
{
    if ((typeof(global::Odo.Html.Rendering.SelectorRenderData).IsAssignableFrom(this.Session["Data"].GetType()) == false))
    {
        this.Error("The type \'Odo.Html.Rendering.SelectorRenderData\' of the parameter \'Data\' did not " +
                "match the type of the data passed to the template.");
    }
    else
    {
        this._DataField = ((global::Odo.Html.Rendering.SelectorRenderData)(this.Session["Data"]));
        DataValueAcquired = true;
    }
}
if ((DataValueAcquired == false))
{
    object data = global::System.Runtime.Remoting.Messaging.CallContext.LogicalGetData("Data");
    if ((data != null))
    {
        if ((typeof(global::Odo.Html.Rendering.SelectorRenderData).IsAssignableFrom(data.GetType()) == false))
        {
            this.Error("The type \'Odo.Html.Rendering.SelectorRenderData\' of the parameter \'Data\' did not " +
                    "match the type of the data passed to the template.");
        }
        else
        {
            this._DataField = ((global::Odo.Html.Rendering.SelectorRenderData)(data));
        }
    }
}


    }
}


        
        #line default
        #line hidden
    }
    
    #line default
    #line hidden
    #region Base class
    /// <summary>
    /// Base class for this transformation
    /// </summary>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.TextTemplating", "10.0.0.0")]
    public class SelectorTemplateBase
    {
        #region Fields
        private global::System.Text.StringBuilder generationEnvironmentField;
        private global::System.CodeDom.Compiler.CompilerErrorCollection errorsField;
        private global::System.Collections.Generic.List<int> indentLengthsField;
        private string currentIndentField = "";
        private bool endsWithNewline;
        private global::System.Collections.Generic.IDictionary<string, object> sessionField;
        #endregion
        #region Properties
        /// <summary>
        /// The string builder that generation-time code is using to assemble generated output
        /// </summary>
        protected System.Text.StringBuilder GenerationEnvironment
        {
            get
            {
                if ((this.generationEnvironmentField == null))
                {
                    this.generationEnvironmentField = new global::System.Text.StringBuilder();
                }
                return this.generationEnvironmentField;
            }
            set
            {
                this.generationEnvironmentField = value;
            }
        }
        /// <summary>
        /// The error collection for the generation process
        /// </summary>
        public System.CodeDom.Compiler.CompilerErrorCollection Errors
        {
            get
            {
                if ((this.errorsField == null))
                {
                    this.errorsField = new global::System.CodeDom.Compiler.CompilerErrorCollection();
                }
                return this.errorsField;
            }
        }
        /// <summary>
        /// A list of the lengths of each indent that was added with PushIndent
        /// </summary>
        private System.Collections.Generic.List<int> indentLengths
        {
            get
            {
                if ((this.indentLengthsField == null))
                {
                    this.indentLengthsField = new global::System.Collections.Generic.List<int>();
                }
                return this.indentLengthsField;
            }
        }
        /// <summary>
        /// Gets the current indent we use when adding lines to the output
        /// </summary>
        public string CurrentIndent
        {
            get
            {
                return this.currentIndentField;
            }
        }
        /// <summary>
        /// Current transformation session
        /// </summary>
        public virtual global::System.Collections.Generic.IDictionary<string, object> Session
        {
            get
            {
                return this.sessionField;
            }
            set
            {
                this.sessionField = value;
            }
        }
        #endregion
        #region Transform-time helpers
        /// <summary>
        /// Write text directly into the generated output
        /// </summary>
        public void Write(string textToAppend)
        {
            if (string.IsNullOrEmpty(textToAppend))
            {
                return;
            }
            // If we're starting off, or if the previous text ended with a newline,
            // we have to append the current indent first.
            if (((this.GenerationEnvironment.Length == 0) 
                        || this.endsWithNewline))
            {
                this.GenerationEnvironment.Append(this.currentIndentField);
                this.endsWithNewline = false;
            }
            // Check if the current text ends with a newline
            if (textToAppend.EndsWith(global::System.Environment.NewLine, global::System.StringComparison.CurrentCulture))
            {
                this.endsWithNewline = true;
            }
            // This is an optimization. If the current indent is "", then we don't have to do any
            // of the more complex stuff further down.
            if ((this.currentIndentField.Length == 0))
            {
                this.GenerationEnvironment.Append(textToAppend);
                return;
            }
            // Everywhere there is a newline in the text, add an indent after it
            textToAppend = textToAppend.Replace(global::System.Environment.NewLine, (global::System.Environment.NewLine + this.currentIndentField));
            // If the text ends with a newline, then we should strip off the indent added at the very end
            // because the appropriate indent will be added when the next time Write() is called
            if (this.endsWithNewline)
            {
                this.GenerationEnvironment.Append(textToAppend, 0, (textToAppend.Length - this.currentIndentField.Length));
            }
            else
            {
                this.GenerationEnvironment.Append(textToAppend);
            }
        }
        /// <summary>
        /// Write text directly into the generated output
        /// </summary>
        public void WriteLine(string textToAppend)
        {
            this.Write(textToAppend);
            this.GenerationEnvironment.AppendLine();
            this.endsWithNewline = true;
        }
        /// <summary>
        /// Write formatted text directly into the generated output
        /// </summary>
        public void Write(string format, params object[] args)
        {
            this.Write(string.Format(global::System.Globalization.CultureInfo.CurrentCulture, format, args));
        }
        /// <summary>
        /// Write formatted text directly into the generated output
        /// </summary>
        public void WriteLine(string format, params object[] args)
        {
            this.WriteLine(string.Format(global::System.Globalization.CultureInfo.CurrentCulture, format, args));
        }
        /// <summary>
        /// Raise an error
        /// </summary>
        public void Error(string message)
        {
            System.CodeDom.Compiler.CompilerError error = new global::System.CodeDom.Compiler.CompilerError();
            error.ErrorText = message;
            this.Errors.Add(error);
        }
        /// <summary>
        /// Raise a warning
        /// </summary>
        public void Warning(string message)
        {
            System.CodeDom.Compiler.CompilerError error = new global::System.CodeDom.Compiler.CompilerError();
            error.ErrorText = message;
            error.IsWarning = true;
            this.Errors.Add(error);
        }
        /// <summary>
        /// Increase the indent
        /// </summary>
        public void PushIndent(string indent)
        {
            if ((indent == null))
            {
                throw new global::System.ArgumentNullException("indent");
            }
            this.currentIndentField = (this.currentIndentField + indent);
            this.indentLengths.Add(indent.Length);
        }
        /// <summary>
        /// Remove the last indent that was added with PushIndent
        /// </summary>
        public string PopIndent()
        {
            string returnValue = "";
            if ((this.indentLengths.Count > 0))
            {
                int indentLength = this.indentLengths[(this.indentLengths.Count - 1)];
                this.indentLengths.RemoveAt((this.indentLengths.Count - 1));
                if ((indentLength > 0))
                {
                    returnValue = this.currentIndentField.Substring((this.currentIndentField.Length - indentLength));
                    this.currentIndentField = this.currentIndentField.Remove((this.currentIndentField.Length - indentLength));
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Remove any indentation
        /// </summary>
        public void ClearIndent()
        {
            this.indentLengths.Clear();
            this.currentIndentField = "";
        }
        #endregion
    }
    #endregion
}
