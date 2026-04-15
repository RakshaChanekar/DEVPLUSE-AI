using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data.SqlClient;

public partial class Add_cart : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnadd_Click(object sender, EventArgs e)
    {

         int stock_int =Convert.ToInt32 (Request.QueryString["sk"]);
        int stock_now = stock_int - 1;

        if (stock_int == 0)
        {
            lblmsg.Text = "Product is Out of stock..";
        }
        else
        {
            if (stock_now < 0)
            {
                lblmsg.Text = "Product is Out of stock..";
            }
            else
            {

                SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
                SqlCommand cmd = new SqlCommand();
                con.Open();
                cmd.Connection = con;
                cmd.CommandText = "update Add_Product set stock=@stock where pid=@pid";
                cmd.Parameters.AddWithValue("@stock", stock_now);
                cmd.Parameters.AddWithValue("@pid", Request.QueryString["pid"].ToString());
                int i = cmd.ExecuteNonQuery();
                con.Close();
                if (i > 0)
                {
                    lblmsg.Text = "your order placed successfully!!";
                    Response.Redirect("Add-cart.aspx?pid="+Request.QueryString["pid"]+"&sk="+stock_now);
                }
                else
                {
                    lblmsg.Text = "There are some issues to check out..Plz try  Again!!";
                }
            }
        }
    }
}