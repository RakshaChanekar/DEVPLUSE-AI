using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;


public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // Response.Write(Request.UserHostAddress);
       //ClassCheck cs = new ClassCheck();
       //cs.lis(Server.MapPath("MasterPage.master"), Server.MapPath("MasterPage.master.cs"), Server.MapPath("web.config"));
        
    }
   

    protected void Button2_Click(object sender, EventArgs e)
    {

        try
        {
            string name = Request.Form["name"];
            string pass = Request.Form["Password"];
            SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd = new SqlCommand();
            con.Open();
            cmd.Connection = con;
          //  cmd.CommandText = "select * from Registration where username=@name and pwd=@pwd";
            cmd.CommandText = "select * from Registration where  convert(varbinary, username) = convert(varbinary, @name)  and   convert(varbinary, pwd) = convert(varbinary, @pwd)";
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
            catch(Exception er)
            {
                Response.Write("<script>alert('login Fail...Enter correct Name or Password'); </script>");
                Response.Write("<script>window.location.href='Default.aspx';</script>");
            }
        

        //Response.Write("yes");
     
    }

    protected void txtsearch_TextChanged(object sender, EventArgs e)
    {
        Response.Write("yest");
    }
}