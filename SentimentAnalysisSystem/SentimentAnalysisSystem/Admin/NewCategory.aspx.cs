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

    }

    protected void btnsubmit_Click(object sender, EventArgs e)
    {
        if (FileUpload_product.HasFile == true)
        {
            string xpath = Server.MapPath("../");
            string path = xpath  +"\\photos\\"+ FileUpload_product.FileName;
            FileUpload_product.SaveAs(path);
        }
        else
        {
            lblmsg.Text = "File not uploaded";
        }

        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd = new SqlCommand();
        con.Open();
        cmd.Connection = con;
        cmd.CommandText = "insert into Add_Product(pname,prate,mrp,describe,photo,category,stock,display,color,memory) values (@name,@rate,@mrp,@desc,@photo,@category,@stock,@display,@color,@memory)";
        cmd.Parameters.AddWithValue("@name", txtname.Text);
        cmd.Parameters.AddWithValue("@rate", txtrate.Text);
        cmd.Parameters.AddWithValue("@mrp", txtMRP.Text);
        cmd.Parameters.AddWithValue("@desc", txtdescrib.Text);
        cmd.Parameters.AddWithValue("@photo", FileUpload_product.FileName.ToString());
        cmd.Parameters.AddWithValue("@category",ddlCategory.SelectedItem.ToString());
        cmd.Parameters.AddWithValue("@stock", txtstock.Text);
        cmd.Parameters.AddWithValue("@display", txtDispaly.Text);
        cmd.Parameters.AddWithValue("@color", txtColor.Text);
        cmd.Parameters.AddWithValue("@memory", txtMemory.Text);
        int i = cmd.ExecuteNonQuery();
        con.Close();

        txtdescrib.Text = "";
        txtname.Text = "";
        txtrate.Text = "";
        txtstock.Text = "";
        FileUpload_product.Dispose();


        if (i == null)
        {
            lblmsg.Text = "Your product is not added..Try again!!";
        }
        else
        {
             lblmsg.Text = "Your product is added..";
        }

    }
}