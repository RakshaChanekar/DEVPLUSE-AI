<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="Review_Amazon.aspx.cs" Inherits="Users_Details" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">


      
      <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">Amazon Site</h3>
                            <h3 class="heading-tittle text-center font-italic"></h3>

                            <h3 class="heading-tittle text-center font-italic">


                                <asp:Chart ID="Chart2" runat="server" DataSourceID="SqlDataSource2">
                                    <Series>
                                        <asp:Series Name="Series1" XValueMember="ctype" YValueMembers="count"></asp:Series>
                                    </Series>
                                    <ChartAreas>
                                        <asp:ChartArea Name="ChartArea1"></asp:ChartArea>
                                    </ChartAreas>
                                </asp:Chart>
                                <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" SelectCommand="SELECT [ctype], [count] FROM [AnalysisReview_Amazon]"></asp:SqlDataSource>
                            </h3>
                            

                          <div>
                              <br />
                                      
                          </div>
                                       <br />    
						</div>



    </form>
</asp:Content>

