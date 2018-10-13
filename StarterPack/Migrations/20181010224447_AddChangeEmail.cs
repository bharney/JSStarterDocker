using Microsoft.EntityFrameworkCore.Migrations;

namespace StarterKit.Migrations
{
    public partial class AddChangeEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UnConfirmedEmail",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnConfirmedEmail",
                table: "AspNetUsers");
        }
    }
}
