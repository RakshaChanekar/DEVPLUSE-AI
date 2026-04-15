using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class Users_Delete_fromcart : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd = new SqlCommand();
        con.Open();
        cmd.Connection = con;
        cmd.CommandText = "delete from Temp where pid=@pid and user_id=@uid";
        cmd.Parameters.AddWithValue("@pid", Request.QueryString["pid"].ToString());
        cmd.Parameters.AddWithValue("@uid", Request.QueryString["uid"].ToString());
        cmd.ExecuteNonQuery();
        con.Close();
        Response.Redirect("Add-cart.aspx");
    }
}