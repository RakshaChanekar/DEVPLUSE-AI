<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="Review.aspx.cs" Inherits="Users_Details" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">
      <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">Analysis</h3>
                            <h3 class="heading-tittle text-center font-italic"></h3>

                            <h3 class="heading-tittle text-center font-italic">


                                <asp:Chart ID="Chart1" runat="server" DataSourceID="SqlDataSource1">
                                    <Series>
                                        <asp:Series Name="Series1" XValueMember="ctype" YValueMembers="count"></asp:Series>
                                    </Series>
                                    <ChartAreas>
                                        <asp:ChartArea Name="ChartArea1"></asp:ChartArea>
                                    </ChartAreas>
                                </asp:Chart>
                                <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" SelectCommand="SELECT [ctype], [count] FROM [AnalysisReview]"></asp:SqlDataSource>
                            </h3>
                            <h3 class="heading-tittle text-center font-italic">Product Review</h3>
							


                          <div>
                              <br />
                                        <asp:TextBox ID="txtreview" runat="server" class="form-control" 
                                                placeholder="Add your comment.." style="float: left" Width="78%" 
                                                TextMode="MultiLine"></asp:TextBox></br><br /><br /><br />
                                        &nbsp;<asp:Button ID="Button1" runat="server" Text="Add Comment" class="btn-danger" 
                                                onclick="Button1_Click" UseSubmitBehavior="False" Height="38px" ></asp:Button>

                                              <a href="Review_Others.aspx?pid=<%# Request.QueryString["pid"].ToString() %>" class="btn btn-primary">  Other Platform  </a>

                          </div>
                                       <br />    
                           
                
    

          <asp:Repeater ID="Repeater1" runat="server" DataSourceID="SqlDataSource_review" 
                                                onitemcommand="Repeater1_ItemCommand" >
                                        <ItemTemplate>



                            <div class="emply-resume-list row mb-3">
                            <div class="col-md-9 emply-info">
                                <div class="emply-img">
                                    <img src="../images/studimage.png" alt="" width="60px" height="60px" class="img-fluid">
                                </div>
                                <div class="emply-resume-info"><asp:Label ID="lblveg" runat="server" Text=""></asp:Label>
                                    <h4><a href="#" style="float: left"><%#Eval("uname") %></a> </h4>
                                   
                                  
                                    <div style="clear: both"></div>
                                  
                                  
                                    
                  
    
                   
               
                                   <%-- <p><i class="fas fa-map-marker-alt"></i> <%#Eval("colony") %></p>--%>
                                  <%-- <p><%#Eval("review") %></p> --%>
                                   
                                </div>   
      
                                <div class="clearfix"></div>
                                <p><%#Eval("review") %></p>
                            </div>
                             <div class="col-md-3 job-single-time text-right">
                                                <span class="job-time" style="color: #FFFFFF"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                                                     </span>
                                                       
                                                <%--<a href="otp_popup.aspx?mname=<%#Eval("mess_name")%>" class="aply-btn ">View Contact</a>--%>
                                             <%-- <a href="ViewMessaspx.aspx?mname=<%#Eval("mess_name")%>&veg=<%#Eval("veg")%>" class="aply-btn ">View Contact</a>--%>
                                            </div>
                     
                        </div>
                       
                        
                        
                        </ItemTemplate>
                                        </asp:Repeater>

						</div>

                         <asp:SqlDataSource ID="SqlDataSource_review" runat="server" 
                                                ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                                SelectCommand="SELECT * FROM [Review] WHERE ([pid] = @pid) and ([review]!='null')">
                                                <SelectParameters>
                                                    <asp:QueryStringParameter Name="pid" QueryStringField="pid" 
                                                        Type="Int32" />
                                                </SelectParameters>
                                            </asp:SqlDataSource>
    </form>
</asp:Content>

