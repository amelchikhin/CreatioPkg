namespace Terrasoft.Configuration.TreatmentProgramsWebService
{
    using System;
    using System.ServiceModel;
    using System.ServiceModel.Web;
    using System.ServiceModel.Activation;
    using Terrasoft.Core;
    using Terrasoft.Core.DB;
    using Terrasoft.Common;
    using Terrasoft.Web.Common;
    using Terrasoft.Core.Entities; 

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class TreatmentProgramsWebService: BaseService
    {

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json)]
        public int GetSumSessionTime(string code) {
            var groupSectionQuery = new Select(UserConnection)
                .Column("Id")
                .From("TraetmentPrograms")
                .Where("Code")
                    .IsEqual(Column.Parameter(code))
                as Select;
			var groupSectionQueryStatus = new Select(UserConnection)
               .Column("Id")
               .From("SessionStatus")
               .Where("Value")
                   .IsEqual(Column.Parameter("Запланирован"))
                as Select;
            Guid id = groupSectionQuery.ExecuteScalar<Guid>();
			Guid idStatus = groupSectionQueryStatus.ExecuteScalar<Guid>();
            if (id==Guid.Empty) {
                return -1;
            }
            var countQuery = new Select(UserConnection)
                .Column(Func.Sum("SessionTime")).As("SumSessionTime")
                .From("Session")
                .Where("TraetmentProgramId").IsEqual(Column.Parameter(id))
				.And("SessionStatusId").IsEqual(Column.Parameter(idStatus))
                as Select;
            int result = countQuery.ExecuteScalar<int>();
            
            return result;
        }
    }
}