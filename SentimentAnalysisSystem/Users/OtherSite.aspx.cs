using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Users_Details : System.Web.UI.Page
{
    SqlConnection con;
    SqlCommand cmd;
    protected void Page_Load(object sender, EventArgs e)
    {
        //

        //  sql

        SqlDataSourceAmazon.SelectCommand = "select  top 1 * from Add_Product_Amazon where pid=" + Request.QueryString["pid"] + "";


        SqlDataSourceRelienceDigital.SelectCommand = "select  top 1 * from Add_Product_Relience_Digital where pid=" + Request.QueryString["pid"] + "";


        SqlDataSourceFlipkart.SelectCommand = "select  top 1 * from Add_Product_Flipkart where pid=" + Request.QueryString["pid"] + "";



        //
    }


    protected void Button1_Click(object sender, EventArgs e)
    {
     
    }
    protected void Repeater1_ItemCommand(object source, RepeaterCommandEventArgs e)
    {

    }

    protected void Button1_Click1(object sender, EventArgs e)
    {
        Response.Redirect("Analysis.aspx?pid="+Request.QueryString["pid"]);
    }
}