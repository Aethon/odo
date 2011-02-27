using Example.Business;
using Odo.Core.Semantics;

namespace Example.Web.ViewModels
{
    public class SelectorViewModel : SemanticGroup
    {
        public Select<FacilityType,FacilityType> FacilityTypes { get; private set; }

        public SelectorViewModel()
        {
            this.Select(s => s.FacilityTypes, s => FacilityTypeInitializer.AllFacilityTypes, captureId: "ParallelSelect", captureKey: x => x.Key);
        }
    }
}