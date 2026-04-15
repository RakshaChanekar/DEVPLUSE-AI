using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Adminlogin : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string name = Request.QueryString["Name"].ToString();
        string pwd = Request.QueryString["Password"].ToString();

        if (name == "Admin" && pwd == "Admin")
        {
           Response.Redirect("Admin/View_product.aspx");
        }
        else
        {
            //Response.Redirect("loginfail.aspx");
            Response.Write("<script>alert('login Fail...Enter correct Name or Password'); </script>");
            Response.Write("<script>window.location.href='Default.aspx';</script>");

        }
    }
}