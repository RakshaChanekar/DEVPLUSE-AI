using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;

public partial class Users_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            DropDownList1.Items.Insert(0, new ListItem("-- Select Category --", ""));
            BindProducts();        
        }
    

        //--!Recommendation..//



        //// Apriori Algo...
        //string newSearch = "";

        //// Split the search block into an array of words.
        //string[] wordsToMatch = newSearch.Split(new char[] { '.', '?', '!', ',', ' ' });
        //// Response.Write(sentences1[1]);
        //for (int i = 0; i < wordsToMatch.Length; i++)
        //{

        //    SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        //    SqlCommand cmd = new SqlCommand();
        //    con.Open();
        //    cmd.Connection = con;
        //    cmd.CommandText = "select * from Add_Product where pname like'%" + wordsToMatch[i] + "%'";
        //    SqlDataReader dr = cmd.ExecuteReader();
        //    while (dr.Read())
        //    {
        //        int pid = dr.GetInt32(dr.GetOrdinal("pid"));
        //        int stock = dr.GetInt32(dr.GetOrdinal("stock"));
        //        Session.Add("pid", pid);
        //        Session.Add("stock", stock);
        //    }
        //    con.Close();

        //    try
        //    {
        //        SqlDataSource_pview.SelectCommand = "select * from Add_Product where pname like '%" + wordsToMatch[0] + "%' OR pname like '%" + wordsToMatch[1] + "%'";
        //    }
        //    catch
        //    {
        //        SqlDataSource_pview.SelectCommand = "select * from Add_Product where pname like '%" + wordsToMatch[0] + "%'";
        //    }
        //}
    }
    private void BindProducts(string selectedCategory = "")
    {
        string clientIp = (Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ??
                         Request.ServerVariables["REMOTE_ADDR"]).Split(',')[0].Trim();

        string query = "";

        //---Show recommendation---//

        string[] str = new string[1];
        int j = 0;
        SqlConnection con_r = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd_r = new SqlCommand();
        con_r.Open();
        cmd_r.Connection = con_r;
        // cmd_r.CommandText = "select top 3 pname from SearchProduct where id=@id";
        //cmd_r.Parameters.AddWithValue("@id", Session["id"]);
      //  cmd_r.CommandText = "select top 1 * from Recommendation where user_id=@user_id order by id Desc ";
        cmd_r.CommandText = "select search_products , COUNT(*)  from Recommendation  group by search_products order by count(*) desc ";
        cmd_r.Parameters.AddWithValue("@user_id", Session["user_id"]);
        cmd_r.Connection = con_r;
        SqlDataReader dr_r = cmd_r.ExecuteReader();
        if (dr_r.Read())
        {
            str[0] = dr_r.GetString(0).ToString();
           // j++;
        }
        con_r.Close();

        //if (string.IsNullOrWhiteSpace(str[1]))
        //    str[1] = "LIS";

        //if (string.IsNullOrWhiteSpace(str[2]))
        //    str[2] = "LIS";

        if (string.IsNullOrWhiteSpace(str[0]))
        {
        }
        else
        {
            Response.Write( str[0]);
            // string query = "SELECT TOP (3) pid, photo, pname, pdesc, pamount FROM Product where pname like '%" + str[0] + "%' or pname like '%" + str[1] + "%'  or pname like '%" + str[2] + "%' order by pid desc";
          //  query = "SELECT TOP (3) * FROM Add_Product where pname like '%" + str[0] + "%' or pname like '%" + str[1] + "%'  or pname like '%" + str[2] + "%' or pname like '%" + str[3] + "%' or pname like '%" + str[4] + "%' order by pid desc";
            query = "SELECT  * FROM Add_Product where pname like '%" + str[0] + "%' order by pid";
        
            
            SqlDataSource_pview.SelectCommand = query;
        }


       // string query = "SELECT photo, pname, prate, mrp FROM Add_Product";

        if (!string.IsNullOrEmpty(selectedCategory))
        {
            query = " SELECT  * FROM Add_Product where category  like @category   order by pid";
        }

        string constr = ConfigurationManager.ConnectionStrings["FunctionalConnectionString"].ConnectionString;
        using (SqlConnection con = new SqlConnection(constr))
        {
            using (SqlCommand cmd = new SqlCommand(query, con))
            {
                if (!string.IsNullOrEmpty(selectedCategory))
                {
                    cmd.Parameters.AddWithValue("@category", selectedCategory);
                }

                using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                {
                    DataTable dt = new DataTable();
                    sda.Fill(dt);
                    Repeater_pview.DataSource = dt;
                    Repeater_pview.DataBind();
                }
            }
        }

        

    }
    protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
    {
       
        string selectedProduct = DropDownList1.SelectedValue;
        BindProducts(selectedProduct);
    }
}