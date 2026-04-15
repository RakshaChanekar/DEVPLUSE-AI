using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Adminlogin : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string name = Request.QueryString["Name"].ToString();
        string pass = Request.QueryString["Password"].ToString();

        try
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd = new SqlCommand();
            con.Open();
            cmd.Connection = con;
            cmd.CommandText = "select * from Registration where convert(varbinary, username) = convert(varbinary, @name)  and   convert(varbinary, pwd) = convert(varbinary, @pwd)";
            cmd.Parameters.AddWithValue("@name", name);
            cmd.Parameters.AddWithValue("@pwd", pass);
            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.Read() != null)
            {
                int id = dr.GetInt32(0);
                Session.Add("user_id", id);
                Response.Redirect("Users/Default.aspx");
                // Response.Redirect("Users/Addtocart.aspx?pid=" + Session["pid"].ToString() + "&stk=" + Session["stock"].ToString());

            }
        }
        catch (Exception er)
        {
            Response.Write("<script>alert('login Fail...Enter correct Name or Password'); </script>");
            Response.Write("<script>window.location.href='Default.aspx';</script>");
        }


        //Response.Write("yes
    }
}