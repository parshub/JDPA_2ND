package com.jdpa.restservices;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import com.jdpa.dbUtil.DBUtilities;
import com.jdpa.graph.TestQuestionAlgorithm;


@Path("/jdpawebapp")
public class RestServices 
{
	DBUtilities objectOfDB = new DBUtilities() ;
	DateFormat dateFormat = new SimpleDateFormat("dd_MM_yyyy__HH_mm_ss_ms");
	
	String date ;		///= dateFormat.format(new Date());
	
	public String getDate() {
		return date = dateFormat.format(new Date());
	}

	@POST
	@Path("/testcasegenrater")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String createTraversalPathJson(JSONObject surveyName)
	{
		try
		{			
			TestQuestionAlgorithm stringToJsonUtil = new TestQuestionAlgorithm();
			String survey = (String) surveyName.get("surveyName");
			survey = survey.replace(" ", "");
			System.out.println("survey");
			JSONObject jsonObj = stringToJsonUtil.generateGraphService(survey);
			objectOfDB.saveData("JDPA_WEB","graph_"+survey, jsonObj);
			return "Success!";
		}
		catch(Exception e)
		{
			return "Fail!";
		}
	}
	
	@POST
	@Path("/questiondata")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public void saveQuestionData(JSONObject questiondata) throws ParseException
	{		
		String survey = (String) questiondata.get("Survey Name");
		survey = survey.replace(" ", "");
		String dbName = (String) questiondata.get("For");
		objectOfDB.saveData("JDPA_"+dbName , survey, questiondata);
	}
	
	@GET
	@Path("/listofSurveynameforweb")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<String> questionCollectionNameOfListforweb()
	{
		List<String> listOfSurveyName = new ArrayList<String> ();
		listOfSurveyName = objectOfDB.getListOfSurveyNameFormDB("JDPA_WEB");
		return listOfSurveyName;
	}
	
	@GET
	@Path("/listofSurveynameformobile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<String> questionCollectionNameOfListformobile()
	{
		List<String> listOfSurveyName = new ArrayList<String> ();
		listOfSurveyName = objectOfDB.getListOfSurveyNameFormDB("JDPA_MOBILE");
		return listOfSurveyName;
	}
	
	
	@POST
	@Path("/listofTestcaseName")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject testcaseCollectionNameOfList(String surveyName) throws ParseException
	{
		List<String> listOfTestcaseName = new ArrayList<String> ();
		JSONObject jsonObject = new JSONObject();
	    jsonObject = objectOfDB.getJSONObject("JDPA_WEB","graph_"+surveyName, "");
	    System.out.println(jsonObject);
	    return jsonObject;
	}
	
	@POST
	@Path("/configurationfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String saveConfigurationFile(JSONObject configurationfile) throws ParseException
	{	
		String success = "Failed to save data !";
		System.out.println("configurationfile  "+configurationfile);
		String dbName = (String) configurationfile.get("For");
		String configCollectionName = "TestSession_" + dbName + "_" + getDate();
		System.out.println("configCollectionName : " + configCollectionName);
		
		if (!configurationfile.isEmpty()) {
			objectOfDB.saveData("JDPA_"+dbName ,configCollectionName, configurationfile);
			success = "Saved successfully !";
		}
		return success;
		
	}

	@POST
	@Path("/testcaseupdate")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public void testcaseDataUpdate(JSONObject testcase) throws ParseException
	{
		String survey = (String) testcase.get("Survey Name");
		survey = "graph_"+survey;
		String testcaseName = (String) testcase.get("Testcase Name");
		JSONObject jsonObject = new JSONObject();
		jsonObject.putAll((Map) testcase.get("Data"));
		objectOfDB.updateDBForTestcase(survey, testcaseName, jsonObject);
	}
	
	@POST
	@Path("/questionOldData")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject getOldquestionData(String questiondata) throws ParseException
	{
		System.out.println("questiondata------------------------"+questiondata);
		JSONObject questioJson = objectOfDB.getJSONObject("JDPA_WEB",questiondata, "");
		System.out.println(questioJson);
		return questioJson;
 	}
	
	@POST
	@Path("/questionUpdate")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String questionDataUpdate(JSONObject questiondata) throws ParseException
	{
		String status ="fail to update";
		
		System.out.println("questiondata------------------------"+questiondata);
		JSONObject jsonObject = new JSONObject();
		jsonObject.putAll((Map) questiondata.get("Data"));
		
		Set quetionKeySet = jsonObject.keySet();
		 Iterator qnArr = quetionKeySet.iterator();
		
		 String quetionKey = null;
		while (qnArr.hasNext()) {
			quetionKey = (String) qnArr.next();
		}
		String surveyName = (String) questiondata.get("Survey Name");
		objectOfDB.updateDBForQuetionData(surveyName,quetionKey, jsonObject);
		
		return status;
 	}
	
	@GET
    @Path("/getLatestTestReports")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public JSONObject getLatestTestReports(String reportType) throws ParseException {
        String testReportType = "Web";
        testReportType = reportType;
//        DBUtilities objectOfDB = new DBUtilities();
        RestServices rs = new RestServices();
        
        String latestConfigTestResultName = rs.getCurrentTestResultsFromDB();
        JSONObject testResultReportObj = objectOfDB.getJSONObject("JDPA_WEB",latestConfigTestResultName, "");
       
        return testResultReportObj;
    }
	
	public String getCurrentTestResultsFromDB() {
		
        Set<String> collectionsList = objectOfDB.getCollectionNamesFromDB();
//        System.out.println("collectionsList : "+collectionsList);
         ArrayList<String> testResultsColls = new ArrayList<String>();
         
        for(String collName: collectionsList){
            if(collName.contains("TestResult_Web")) testResultsColls.add(collName);
        }
//        System.out.println("testSessionsColls : "+testSessionsColls);
        SortedSet sortTestResultCollestions = new TreeSet<>(testResultsColls);
        System.out.println("sortTestResultCollestions : "+ sortTestResultCollestions);
        System.out.println("sortTestResultCollestions : "+ sortTestResultCollestions.last());
        return (String) sortTestResultCollestions.last();
    }

	
}
