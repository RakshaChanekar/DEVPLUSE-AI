using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class Registration : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

       
        string name = Request.QueryString["Name"].ToString();
        string email = Request.QueryString["Email"].ToString();
        string pwd = Request.QueryString["Password"].ToString();
        string mobile = Request.QueryString["Mobile"].ToString();
        string username = Request.QueryString["Username"].ToString();
        string cpwd = pwd;


        SqlConnection con1 = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd1 = new SqlCommand();
        con1.Open();
        cmd1.Connection = con1;
        cmd1.CommandText = "select * from Registration where email='"+email+"'";
        SqlDataReader dr1= cmd1.ExecuteReader();
        if (dr1.Read() == false)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd = new SqlCommand();
            con.Open();
            cmd.Connection = con;
            cmd.CommandText = "insert into Registration (name,email,pwd,cpwd,username,mobileno) values(@name,@email,@pwd,@cpwd,@username,@mobileno)";
            cmd.Parameters.AddWithValue("@name", name);
            cmd.Parameters.AddWithValue("@email", email);
            cmd.Parameters.AddWithValue("@pwd", pwd);
            cmd.Parameters.AddWithValue("@cpwd", cpwd);
            cmd.Parameters.AddWithValue("@username", username);
            cmd.Parameters.AddWithValue("@mobileno", mobile);
            int i = cmd.ExecuteNonQuery();
            if (i != null)
            {
                Response.Write("<script>alert('Registration successful');</script>");
                Response.Write("<script>window.location.href='Default.aspx';</script>");
                // Response.Redirect("Default.aspx");
            }
            else
            {
                Response.Write("<script>alert('Registration not successful..try again!!');</script>");
                Response.Write("<script>window.location.href='Default.aspx';</script>");
            }
        }
        else
        {
            Response.Write("<script>alert('Email ID Already Register!!');</script>");
            Response.Write("<script>window.location.href='Default.aspx';</script>");
        }
    }
}