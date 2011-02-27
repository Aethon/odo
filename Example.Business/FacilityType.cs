using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Odo.Core;

namespace Example.Business
{
    public struct FacilityType
    {
        public string Key { get; private set; }

        public string Description { get; private set; } // TEMP: should not go here

        public FacilityType(string key) : this()
        {
            Key = key;
        }

        public FacilityType(string key, string description)
            : this()
        {
            Key = key;
            Description = description;
        }
    }

    public struct FacilityGroup
    {
        public string Key { get; private set; }

        public string Description { get; private set; } // TEMP: should not go here

        public IEnumerable<FacilityType> Members { get; private set; }

        public FacilityGroup(string key)
            : this()
        {
            Key = key;
        }

        public FacilityGroup(string key, string description, IEnumerable<FacilityType> members)
            : this()
        {
            Key = key;
            Description = description;
            Members = members;
        }
    }

    public static class FacilityTypeInitializer
    {
        public static IList<FacilityType> AllFacilityTypes
        {
            get
            {
                return _AllFacilityTypes;
            }
        }
 
        private static readonly IList<FacilityType> _AllFacilityTypes = new ReadOnlyCollection<FacilityType>(new []{
                                                             new FacilityType("14", "364-Day Facility"),
                                                             new FacilityType("28", "Acquisition Facility"),
                                                             new FacilityType("69", "Advance Facility"),
                                                             new FacilityType("8", "Bankers Acceptance"),
                                                             new FacilityType("70", "Bills Facility"),
                                                             new FacilityType("63", "Bonding Facility"),
                                                             new FacilityType("1", "Bridge Loan"),
                                                             new FacilityType("60", "CAPEX Facility"),
                                                             new FacilityType("71", "Construction Facility"),
                                                             new FacilityType("55", "Debt Restructure"),
                                                             new FacilityType("22", "Deferred Payment Lease"),
                                                             new FacilityType("29", "Delay Draw Term Loan"),
                                                             new FacilityType("6", "Demand Loan"),
                                                             new FacilityType("57", "FRN (Bond-Style)"),
                                                             new FacilityType("33", "FRN (Loan-Style)"),
                                                             new FacilityType("50", "Fixed-Rate Bond"),
                                                             new FacilityType("51", "Fixed-Rate CD"),
                                                             new FacilityType("54", "Floating Rate Bond"),
                                                             new FacilityType("34", "Floating Rate CD (loan-style)"),
                                                             new FacilityType("35", "Guarantee"),
                                                             new FacilityType("13", "Guidance Line (Uncommitted)"),
                                                             new FacilityType("66", "Ijara"),
                                                             new FacilityType("52", "Issuance Programme"),
                                                             new FacilityType("32", "Leagues/Other"),
                                                             new FacilityType("19", "Lease"),
                                                             new FacilityType("5", "Limited Line"),
                                                             new FacilityType("59", "Mortgage Facility"),
                                                             new FacilityType("9", "Multi-Option Facility"),
                                                             new FacilityType("64", "Murabaha"),
                                                             new FacilityType("67", "Musharaka"),
                                                             new FacilityType("72", "NIF - Note Issuance Facility"),
                                                             new FacilityType("11", "Note"),
                                                             new FacilityType("0", "Other"),
                                                             new FacilityType("53", "Other Bond"),
                                                             new FacilityType("16", "Other Loan"),
                                                             new FacilityType("18",
                                                                              "Performance Standby Letter of Credit"),
                                                             new FacilityType("4", "Revolver/Line &lt; 1 Yr."),
                                                             new FacilityType("2", "Revolver/Line &gt;= 1 Yr."),
                                                             new FacilityType("25", "Revolver/Term Loan"),
                                                             new FacilityType("62", "Schuldschein"),
                                                             new FacilityType("56", "Securitization"),
                                                             new FacilityType("7", "Standby Letter of Credit"),
                                                             new FacilityType("21", "Step-Payment Lease"),
                                                             new FacilityType("20", "Stnd. Cond. Sale Lease"),
                                                             new FacilityType("65", "Sukuk"),
                                                             new FacilityType("27", "Synthetic Lease"),
                                                             new FacilityType("3", "Term Loan"),
                                                             new FacilityType("41", "Term Loan A"),
                                                             new FacilityType("23", "Term Loan B"),
                                                             new FacilityType("24", "Term Loan C"),
                                                             new FacilityType("26", "Term Loan D"),
                                                             new FacilityType("30", "Term Loan E"),
                                                             new FacilityType("31", "Term Loan F"),
                                                             new FacilityType("36", "Term Loan G"),
                                                             new FacilityType("37", "Term Loan H"),
                                                             new FacilityType("38", "Term Loan I"),
                                                             new FacilityType("39", "Term Loan J"),
                                                             new FacilityType("40", "Term Loan K"),
                                                             new FacilityType("15", "Trade Letter of Credit"),
                                                             new FacilityType("17",
                                                                              "Unadvised Guidance Line (Uncommitted)"),
                                                             new FacilityType("58", "Undisclosed"),
                                                             new FacilityType("61", "VAT"),
                                                             new FacilityType("68", "Wakala"),
                                                         });

        public static IList<FacilityGroup> AllFacilityGroups = new ReadOnlyCollection<FacilityGroup>(new[]
                                                                                                         {
                                                                                                             new FacilityGroup
                                                                                                                 ("1",
                                                                                                                  "Group 1",
                                                                                                                  AllFacilityTypes
                                                                                                                      .
                                                                                                                      TakeWhile
                                                                                                                      ((
                                                                                                                          t,
                                                                                                                          i)
                                                                                                                       =>
                                                                                                                       i <
                                                                                                                       30))
                                                                                                             ,
                                                                                                             new FacilityGroup
                                                                                                                 ("2",
                                                                                                                  "Group 2",
                                                                                                                  AllFacilityTypes
                                                                                                                      .
                                                                                                                      TakeWhile
                                                                                                                      ((
                                                                                                                          t,
                                                                                                                          i)
                                                                                                                       =>
                                                                                                                       i >
                                                                                                                       30))
                                                                                                         });
    }
}
