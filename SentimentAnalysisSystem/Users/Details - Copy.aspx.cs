using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data.SqlClient;

public partial class Users_Details : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //string[] str = new string[3];
        //int j = 0;
        //SqlConnection con_r = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        //SqlCommand cmd_r = new SqlCommand();
        //con_r.Open();
        //cmd_r.Connection = con_r;
        //// cmd_r.CommandText = "select top 3 pname from SearchProduct where id=@id";
        ////cmd_r.Parameters.AddWithValue("@id", Session["id"]);
        //cmd_r.CommandText = "select top 3 * from Recommendation where user_id=0 order by id Desc ";
        //cmd_r.Connection = con_r;
        //SqlDataReader dr_r = cmd_r.ExecuteReader();
        //while (dr_r.Read())
        //{
        //    str[j] = dr_r.GetString(3).ToString();
        //    j++;
        //}
        //con_r.Close();

        //if (string.IsNullOrWhiteSpace(str[1]))
        //    str[1] = "LIS";

        //if (string.IsNullOrWhiteSpace(str[2]))
        //    str[2] = "LIS";


        ////--!Recommendation..//  

        //// Apriori Algo...
        //string newSearch = Request.QueryString["pname"].ToString();

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
        //        //int pid = dr.GetInt32(dr.GetOrdinal("pid"));
        //        //int stock = dr.GetInt32(dr.GetOrdinal("stock"));
        //        //Session.Add("pid", pid);
        //        //Session.Add("stock", stock);

        //    }
        //    con.Close();

        //    //try
        //    //{
        //    //    SqlDataSource_pview.SelectCommand = "select Top 6 * from Add_Product where pname like '%" + wordsToMatch[0] + "%' or  category  like '%" + wordsToMatch[0] + "%'";
        //    //}
        //    //catch
        //    //{
        //    //    SqlDataSource_pview.SelectCommand = "select Top 6 * from Add_Product where pname like '%" + wordsToMatch[0] + "%' OR  category like '%" + wordsToMatch[0] + "%'";
        //    //}



        //    try
        //    {
        //        //string query = "SELECT TOP (3) pid, photo, pname, pdesc, pamount FROM Product where pname like '%" + str[0] + "%' or pname like '%" + str[1] + "%'  or pname like '%" + str[2] + "%' order by pid desc";
        //        string query = "SELECT TOP (3) * FROM Add_Product where pname!='" + Request.QueryString["pname"].ToString() + "' and  (pname like '%" + wordsToMatch[0] + "%' or pname like '%" + wordsToMatch[1] + "%') order by pid desc";
        //        SqlDataSource_recom.SelectCommand = query;
        //    }
        //    catch (Exception er)
        //    {
        //        //string query = "SELECT TOP (3) pid, photo, pname, pdesc, pamount FROM Product where pname like '%" + str[0] + "%' or pname like '%" + str[1] + "%'  or pname like '%" + str[2] + "%' order by pid desc";
        //        string query = "SELECT TOP (3) * FROM Add_Product where pname!='" + Request.QueryString["pname"].ToString() + "' and  (pname like '%" + wordsToMatch[0] + "%' ) order by pid desc";
        //        SqlDataSource_recom.SelectCommand = query;
        //    }
    //}

        
        string category = "";
        SqlConnection con1 = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        SqlCommand cmd1 = new SqlCommand();
        con1.Open();
        cmd1.Connection = con1;
        cmd1.CommandText = "select category from Add_Product where pname like '%" + Request.QueryString["pname"].ToString() + "%'";
        SqlDataReader dr1 = cmd1.ExecuteReader();
        while (dr1.Read())
        {
            category = dr1.GetString(0).ToString();
        }
        con1.Close();


        string[] aname = new string[3];
        aname[0] = "";
        aname[1] = "";
        aname[2] = "";

        int x = 0;
        con1 = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        cmd1 = new SqlCommand();
        con1.Open();
        cmd1.Connection = con1;
        cmd1.CommandText = "select atype from Accs where pname like '%" + category + "%'";
        dr1 = cmd1.ExecuteReader();
        while (dr1.Read())
        {
            aname[x] = dr1.GetString(0);
            x++;
            if (x == 3)
                break;
        }
        con1.Close();


        //  SqlDataSource_recom.SelectCommand = "select distinct Top 3 * from Add_Product inner join Accs on category=Accs.pname";// where category='" + category + "'";
        SqlDataSource_recom.SelectCommand = "select Top 3 * from Add_Product  where pname='" + aname[0] + "' or pname='" + aname[1] + "' or pname='" + aname[2] + "'";




        

    }
}