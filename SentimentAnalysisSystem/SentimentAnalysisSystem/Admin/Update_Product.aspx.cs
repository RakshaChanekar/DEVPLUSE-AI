using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;


public partial class Admin_Add_Product : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd = new SqlCommand();
            con.Open();
            cmd.Connection = con;
            cmd.CommandText = "select stock from Add_Product where pid=" + Request.QueryString["pid"].ToString();
            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
             //   txtstock.Text = dr.GetInt32(0).ToString();
               txtoldstock.Text = dr.GetInt32(0).ToString();
            }
            con.Close();
        }

    }

    protected void btnsubmit_Click(object sender, EventArgs e)
    {

       // int o_stock = Convert.ToInt32(txtoldstock.Text);

        int new_stock = Convert.ToInt32(txtoldstock.Text) + Convert.ToInt32(txtstock.Text);

        //try
        //{
            SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd = new SqlCommand();
            con.Open();
            cmd.Connection = con;
            cmd.CommandText = "update Add_Product set stock=" + new_stock+ " where pid=" + Request.QueryString["pid"].ToString();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            if (i > 0)
            {
                Response.Write("<script>alert('Updated Stock successful');</script>");
                Response.Write("<script>window.location.href='View_product.aspx';</script>");
                // Response.Redirect("Default.aspx");
            }
            else
            {
                Response.Write("<script>alert('Enable to update stock!!');</script>");
                Response.Write("<script>window.location.href='View_product.aspx';</script>");
            }
        //}
        //catch (Exception er)
        //{
        //    Response.Write("<script>alert('Enable to update stock!!');</script>");
        //    Response.Write("<script>window.location.href='Default.aspx';</script>");
        //}

    }
}