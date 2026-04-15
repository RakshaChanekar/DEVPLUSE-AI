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
        getAmazonData();

        getMeeshoData();

        getFlipkartData();



    }



    void getAmazonData()
    {
        //try
        //{
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "select review from Amazon_Reviews where pid='" + Request.QueryString["pid"] + "'";
        cmd.Connection = con;
        SqlDataReader dr = cmd.ExecuteReader();
        int tnc = 0, tpc = 0, tnec = 0;


        while (dr.Read())
        {
            int nc = 0, pc = 0;
            string comment = dr.GetString(0).ToString();
            // Split the text block into an array of sentences.
            string[] sentences = comment.Split(new char[] { '.', '?', '!' });
            // Define the search terms. This list could also be dynamically populated at runtime.

            //Negative World Matching
            string[] narr = { "not", "dislike" };

            string[] nag_pos = { "not bad", "not poor" };

            int status = 0;
            string rev = dr.GetString(0).ToString();
            foreach (string fv in nag_pos)
            {
                if (rev.Contains(fv))
                    status = 1;
            }

            if (status == 0)
            {
                foreach (string ne in narr)
                {
                    string[] wordsToMatch;
                    wordsToMatch = new string[1];
                    wordsToMatch[0] = ne;

                    // Find sentences that contain all the terms in the wordsToMatch array.
                    // Note that the number of terms to match is not specified at compile time.
                    var sentenceQuery = from sentence in sentences
                                        let w = sentence.Split(new char[] { '.', '?', '!', ' ', ';', ':', ',' },

                                                                StringSplitOptions.RemoveEmptyEntries)

                                        where w.Distinct().Intersect(wordsToMatch).Count() == wordsToMatch.Count()

                                        select sentence;
                    // Response.Write(sentenceQuery);
                    foreach (string c in sentenceQuery)
                    {
                        nc += 1;
                    }

                }
            }


            // Possitive world match...


            pc = pc + sentences.Length - 1 - nc;
            // int s = sentences.Length - 1;
            // Response.Write("T="+s+" NC=" + nc+" Pc= "+pc);

            tnc = tnc + nc;
            tpc = tpc + pc;
            if (nc == pc)
                tnec = tnec + 1;
            if (nc > pc && pc != 0)
                tnec = tnec + 1;
            if (nc < pc && nc != 0)
                tnec = tnec + 1;

        }

        string pst = tpc.ToString();
        string ng = tnc.ToString();


        string nu = tnec.ToString();

        con.Close();

        //analysis code 
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Amazon set count=" + tpc + " where ctype='Positive'";

        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();


        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Amazon set count=" + tnc + " where ctype='Negative'";

        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();

        // update overall count

        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReviewAll set count=" + tpc + " where ctype='Amazon'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();
    }


    void getMeeshoData()
    {
        //try
        //{
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "select review from Meesho_Reviews where pid='" + Request.QueryString["pid"] + "'";
        cmd.Connection = con;
        SqlDataReader dr = cmd.ExecuteReader();
        int tnc = 0, tpc = 0, tnec = 0;


        while (dr.Read())
        {
            int nc = 0, pc = 0;
            string comment = dr.GetString(0).ToString();
            // Split the text block into an array of sentences.
            string[] sentences = comment.Split(new char[] { '.', '?', '!' });
            // Define the search terms. This list could also be dynamically populated at runtime.

            //Negative World Matching
            string[] narr = { "not", "dislike" };

            string[] nag_pos = { "not bad", "not poor" };

            int status = 0;
            string rev = dr.GetString(0).ToString();
            foreach (string fv in nag_pos)
            {
                if (rev.Contains(fv))
                    status = 1;
            }

            if (status == 0)
            {
                foreach (string ne in narr)
                {
                    string[] wordsToMatch;
                    wordsToMatch = new string[1];
                    wordsToMatch[0] = ne;

                    // Find sentences that contain all the terms in the wordsToMatch array.
                    // Note that the number of terms to match is not specified at compile time.
                    var sentenceQuery = from sentence in sentences
                                        let w = sentence.Split(new char[] { '.', '?', '!', ' ', ';', ':', ',' },

                                                                StringSplitOptions.RemoveEmptyEntries)

                                        where w.Distinct().Intersect(wordsToMatch).Count() == wordsToMatch.Count()

                                        select sentence;
                    // Response.Write(sentenceQuery);
                    foreach (string c in sentenceQuery)
                    {
                        nc += 1;
                    }

                }
            }


            // Possitive world match...


            pc = pc + sentences.Length - 1 - nc;
            // int s = sentences.Length - 1;
            // Response.Write("T="+s+" NC=" + nc+" Pc= "+pc);

            tnc = tnc + nc;
            tpc = tpc + pc;
            if (nc == pc)
                tnec = tnec + 1;
            if (nc > pc && pc != 0)
                tnec = tnec + 1;
            if (nc < pc && nc != 0)
                tnec = tnec + 1;

        }

        string pst = tpc.ToString();
        string ng = tnc.ToString();


        string nu = tnec.ToString();

        con.Close();

        //analysis code 
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Meesho set count=" + tpc + " where ctype='Positive'";

        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();


        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Meesho set count=" + tnc + " where ctype='Negative'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();

        // update overall count

        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReviewAll set count=" + tpc + " where ctype='Meesho'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();
    }

    void getFlipkartData()
    {
        //try
        //{
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "select review from Flipkart_Reviews where pid='" + Request.QueryString["pid"] + "'";
        cmd.Connection = con;
        SqlDataReader dr = cmd.ExecuteReader();
        int tnc = 0, tpc = 0, tnec = 0;


        while (dr.Read())
        {
            int nc = 0, pc = 0;
            string comment = dr.GetString(0).ToString();
            // Split the text block into an array of sentences.
            string[] sentences = comment.Split(new char[] { '.', '?', '!' });
            // Define the search terms. This list could also be dynamically populated at runtime.

            //Negative World Matching
            string[] narr = { "not", "dislike" };

            string[] nag_pos = { "not bad", "not poor" };

            int status = 0;
            string rev = dr.GetString(0).ToString();
            foreach (string fv in nag_pos)
            {
                if (rev.Contains(fv))
                    status = 1;
            }

            if (status == 0)
            {
                foreach (string ne in narr)
                {
                    string[] wordsToMatch;
                    wordsToMatch = new string[1];
                    wordsToMatch[0] = ne;

                    // Find sentences that contain all the terms in the wordsToMatch array.
                    // Note that the number of terms to match is not specified at compile time.
                    var sentenceQuery = from sentence in sentences
                                        let w = sentence.Split(new char[] { '.', '?', '!', ' ', ';', ':', ',' },

                                                                StringSplitOptions.RemoveEmptyEntries)

                                        where w.Distinct().Intersect(wordsToMatch).Count() == wordsToMatch.Count()

                                        select sentence;
                    // Response.Write(sentenceQuery);
                    foreach (string c in sentenceQuery)
                    {
                        nc += 1;
                    }

                }
            }


            // Possitive world match...


            pc = pc + sentences.Length - 1 - nc;
            // int s = sentences.Length - 1;
            // Response.Write("T="+s+" NC=" + nc+" Pc= "+pc);

            tnc = tnc + nc;
            tpc = tpc + pc;
            if (nc == pc)
                tnec = tnec + 1;
            if (nc > pc && pc != 0)
                tnec = tnec + 1;
            if (nc < pc && nc != 0)
                tnec = tnec + 1;

        }

        string pst = tpc.ToString();
        string ng = tnc.ToString();


        string nu = tnec.ToString();

        con.Close();

        //analysis code 
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Flipkart set count=" + tpc + " where ctype='Positive'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();


        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReview_Flipkart set count=" + tnc + " where ctype='Negative'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();

        // update overall count
        con = new SqlConnection(ConfigurationManager.AppSettings["LIS"]);
        con.Open();
        cmd = new SqlCommand();
        cmd.CommandText = "update AnalysisReviewAll set count=" + tpc + " where ctype='Flipkart'";
        cmd.Connection = con;
        cmd.ExecuteNonQuery();
        con.Close();
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
     
    }
    protected void Repeater1_ItemCommand(object source, RepeaterCommandEventArgs e)
    {

    }
}