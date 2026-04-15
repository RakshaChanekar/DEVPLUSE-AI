using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class Admin_Product_Deatils : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnsubmit_Click(object sender, EventArgs e)
    {


        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd = new SqlCommand();
        con.Open();
        cmd.Connection = con;
        cmd.CommandText = "delete from Add_Product where pname='" + Request.QueryString["pname"] + "'";
        int n = cmd.ExecuteNonQuery();


        if (n > 0)
        {
            Response.Write("<script>alert('Product Deleted successful');</script>");
            Response.Write("<script>window.location.href='Default.aspx';</script>");
        }
        else
        {

        }

    }
    protected void btnedit_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd = new SqlCommand();
        con.Open();
        cmd.Connection = con;
        cmd.CommandText = "SELECT * FROM Add_Product WHERE pname = @pname";
        cmd.Parameters.AddWithValue("@pname", Request.QueryString["pname"].ToString());
        SqlDataReader dr = cmd.ExecuteReader();
        while (dr.Read())
        {
            int id = dr.GetInt32(0);
           // Response.Write(id);
            Response.Redirect("Update_Product.aspx?pid=" + id);
        }
        con.Close();

    }
}