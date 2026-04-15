using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class Users_UserMasterPage : System.Web.UI.MasterPage
{
    SqlConnection conNew;
    SqlCommand cmdNew;
    protected void Page_Load(object sender, EventArgs e)
    {
        //delete 
        conNew = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        cmdNew = new SqlCommand();
        conNew.Open();
        cmdNew.Connection = conNew;
        cmdNew.CommandText = "delete from TempProduct";
        cmdNew.ExecuteNonQuery();
        conNew.Close();


        // lblname.Text = "Ankita";
        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd = new SqlCommand();
        con.Open();
        cmd.Connection = con;
        cmd.CommandText = "select name from Registration where id=" + Session["user_id"].ToString();
        object n = cmd.ExecuteScalar();
        lblname.Text = n.ToString();
        con.Close();

            string[] str = new string[1000];
            string[] search_product = new string[5];
            int sid = 0;
            int j = 0;
            SqlConnection con_r = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd_r = new SqlCommand();
            con_r.Open();
            cmd_r.Connection = con_r;
            cmd_r.CommandText = "select search_products,id from Recommendation where user_id='" + Session["user_id"].ToString() + "' order by  id desc";
            cmd_r.Connection = con_r;
            SqlDataReader dr_r = cmd_r.ExecuteReader();
        
            while (dr_r.Read())
            {
               int s = 0;
               foreach (string search in search_product)
               {
                if (search == dr_r.GetString(0))
                    s = 1;
               }

               if (s == 0)
               {
                conNew = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
                cmdNew = new SqlCommand();
                conNew.Open();
                cmdNew.Connection = conNew;
                cmdNew.CommandText = "INSERT INTO TempProduct(pname,prate,mrp,describe,photo,category,stock,display,color,memory) SELECT pname,prate,mrp,describe,photo,category,stock,display,color,memory FROM Add_product WHERE pname like '%" + dr_r.GetString(0).ToString() + "%'";
                cmdNew.ExecuteNonQuery();
                conNew.Close();
                search_product[sid] = dr_r.GetString(0);
                sid++;
               }
            if (sid == 3)
                break;
            }
            con_r.Close();

            //string query = "SELECT TOP (4) * FROM TempProduct";
           // SqlDataSource_recom.SelectCommand = query;
  
    }
}
