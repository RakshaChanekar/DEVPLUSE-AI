using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;

public partial class MasterPage : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string[] str = new string[1000];
            int j = 0;
            SqlConnection con_r = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
            SqlCommand cmd_r = new SqlCommand();
            con_r.Open();
            cmd_r.Connection = con_r;
            // cmd_r.CommandText = "select top 3 pname from SearchProduct where id=@id";
            //cmd_r.Parameters.AddWithValue("@id", Session["id"]);
            cmd_r.CommandText = "select  count(*),search_products from Recommendation where user_id=0 group by search_products order by count(*) desc";
            cmd_r.Connection = con_r;
            SqlDataReader dr_r = cmd_r.ExecuteReader();
            while (dr_r.Read())
            {
                str[j] = dr_r.GetString(1).ToString();
                j++;
            }
            con_r.Close();

            if (string.IsNullOrWhiteSpace(str[1]))
                str[1] = "LIS";

            if (string.IsNullOrWhiteSpace(str[2]))
                str[2] = "LIS";

            if (string.IsNullOrWhiteSpace(str[0]))
            {

            }
            else
            {
                // Response.Write("----" + str[0] + "---" + str[1] + "----" + str[2]);
                //string query = "SELECT TOP (3) pid, photo, pname, pdesc, pamount FROM Product where pname like '%" + str[0] + "%' or pname like '%" + str[1] + "%'  or pname like '%" + str[2] + "%' order by pid desc";
                string query = "SELECT TOP (3) * FROM Add_Product where pname like '%" + str[0] + "%' OR pname like '%" + str[1] + "%' OR pname like '%" + str[2] + "%'"; //or pname '%"+str[1]+"%' or pname like '%"+str[2]+"%'";
                //string query = "SELECT TOP (3) * FROM Add_Product where pname like '%" + str[0] + "%' OR pname like '%" + str[1] + "%' OR pname like '%" + str[2] + "%' ";
                SqlDataSource_recom.SelectCommand = query;
            }

        }
    }
    //protected void Button2_Click(object sender, EventArgs e)
    //{

    //    tryo
    //    {
    //        string name = Request.Form["name"];
    //        string pass = Request.Form["Password"];
    //        SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
    //        SqlCommand cmd = new SqlCommand();
    //        con.Open();
    //        cmd.Connection = con;
    //        cmd.CommandText = "select * from Registration where name=@name and pwd=@pwd";
    //        cmd.Parameters.AddWithValue("@name", name);
    //        cmd.Parameters.AddWithValue("@pwd", pass);
    //        SqlDataReader dr = cmd.ExecuteReader();
    //        if (dr.Read() != null)
    //        {
    //            int id = dr.GetInt32(0);
    //            Session.Add("user_id", id);
    //            Response.Redirect("Users/Default.aspx");
    //            // Response.Redirect("Users/Addtocart.aspx?pid=" + Session["pid"].ToString() + "&stk=" + Session["stock"].ToString());

    //        }
    //    }
    //    catch (Exception er)
    //    {
    //        Response.Write("<script>alert('login Fail...Enter correct Name or Password'); </script>");
    //        Response.Write("<script>window.location.href='Default.aspx';</script>");
    //    }


    //    //Response.Write("yes");

    //}
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
            cmd.CommandText = "select * from Registration where username=@name and pwd=@pwd";
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
        catch (Exception er)
        {
            Response.Write("<script>alert('login Fail...Enter correct Name or Password'); </script>");
            Response.Write("<script>window.location.href='Default.aspx';</script>");
        }


        //Response.Write("yes");

    }
}
