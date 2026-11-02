using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using PCS.Infrastructure.Persistence;

#nullable disable

namespace PCS.Infrastructure.Migrations.SqlServer.Migrations;

[DbContext(typeof(PCSDbContext))]
[Migration("20261102150000_CompanyUserSoftDeleteMembershipIndex")]
partial class CompanyUserSoftDeleteMembershipIndex
{
}
