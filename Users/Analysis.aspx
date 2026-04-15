<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="Analysis.aspx.cs" Inherits="Users_Details" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">
     
      <div class="product-sec1 px-sm-4 px-3 py-sm-5 py-3 mb-4 "  style="display:flex">
          <div class="row mb-2">
              <div class="product-sec1 px-sm-4 px-3 py-sm-5 py-3 mb-4">
                  <h3 class="heading-tittle text-center font-italic">Product Reviews Analysis</h3>
                  
                  <h3 class="heading-tittle text-center font-italic">
                      <!-- Single chart for both positive and negative reviews -->
                      <asp:Chart ID="ChartCombined" runat="server" DataSourceID="SqlDataSourceCombined" Width="600px" Height="400px">
                          <Series>
                              <asp:Series Name="Positive Reviews" XValueMember="ctype" YValueMembers="count_positive" Color="Green" IsValueShownAsLabel="true"></asp:Series>
                              <asp:Series Name="Negative Reviews" XValueMember="ctype" YValueMembers="count_negative" Color="Red" IsValueShownAsLabel="true"></asp:Series>
                          </Series>
                          <ChartAreas>
                              <asp:ChartArea Name="ChartArea1">
                                  <AxisY Title="Percentage of Reviews"></AxisY>
                                  <AxisX Title="Platforms"></AxisX>
                              </asp:ChartArea>
                          </ChartAreas>
                          <Legends>
                              <asp:Legend Alignment="Center" Docking="Bottom" IsDockedInsideChartArea="false" Name="Default"></asp:Legend>
                          </Legends>
                      </asp:Chart>
                      
                      <asp:SqlDataSource ID="SqlDataSourceCombined" runat="server" 
                          ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                          SelectCommand="SELECT [ctype], [count_positive], [count_negative] FROM [AnalysisReviewAll]">
                      </asp:SqlDataSource>
                  </h3>
            
                   
         </div>
        </div>
   <!-- Recommendation Column -->
   <div class="product-sec1 px-sm-4 px-3 py-sm-5 py-3 mb-4">
    <h3 class="heading-tittle text-center font-italic">Recommendation</h3>
    <asp:Label ID="lblRecommendation" runat="server" 
        Style="display: block; text-align: center; background-color: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; padding: 12px; font-size: 18px; font-weight: bold; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 10px;">
    </asp:Label>
</div>

        
          <br />
                    
      </div>
         
    </form>
</asp:Content>
