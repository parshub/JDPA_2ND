package com.jdpa.graphUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.jdpa.dbUtil.DBUtilities;
import com.jdpa.graph.TestQuestionAlgorithm;


public class QuestionnaireJsonUtil {
	static String fileSeparator = System.getProperty("file.separator");
	String folderName = "TestCases";
	String filename = "Jdpa-QuestionData.json";
	public static JSONObject jsonQuestionCollecion = null;

	List<String> listOfQuestion = new ArrayList<String>();
	List<String> listOfResponse = new ArrayList<String>();
	DataConversion objectOfDataConversion = new DataConversion();

	public void readQuestionnaireCollection(String surveyName) {
		String path = "." + fileSeparator + filename;
		JSONParser questionParser = new JSONParser();
		JSONObject collectionJsonData = null;
		DBUtilities dbUtility = new DBUtilities();

		try {
			collectionJsonData = dbUtility.getJSONObject("JDPA_WEB",surveyName, "Data");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		jsonQuestionCollecion = collectionJsonData;
	}

	public JSONObject getQuestionnaireCollection() {
		return jsonQuestionCollecion;
	}

	public int getLengthOfQuestionsColl() {
		Set<String> keySet = jsonQuestionCollecion.keySet();
		int noOfQuestns = keySet.size();
		return noOfQuestns;
	}

	public List<String> getListOfQuestionsFromQnColl() {
		listOfQuestion = objectOfDataConversion.sortJsonAsPerKey(jsonQuestionCollecion);
		return listOfQuestion;
	}

	
	public List<String> getListOfResponsesForQuestion(String question) {
		JSONObject questnObj = (JSONObject) jsonQuestionCollecion.get(question);
		JSONObject qnResponsesObj = (JSONObject) questnObj.get("Responses");
		listOfResponse = objectOfDataConversion.sortJsonAsPerKey(qnResponsesObj);
		return listOfResponse;
	}

	public int getLengthOfResponsesForQuestion(String question) {
		JSONObject questnObj = (JSONObject) jsonQuestionCollecion.get(question);
		JSONObject qnResponsesObj = (JSONObject) questnObj.get("Responses");
		Set<String> keySet = qnResponsesObj.keySet();
		int noOfResponses = keySet.size();
		return noOfResponses;
	}
	public String getValueOfResponseForQuestion(String question,String responseKey) {
		String responseValue = "";
		JSONObject questnObj = (JSONObject) jsonQuestionCollecion.get(question);
		JSONObject qnResponsesObj = (JSONObject) questnObj.get("Responses");
		JSONObject qnResponseKeyObj = (JSONObject) qnResponsesObj.get(responseKey);
		responseValue = (String) qnResponseKeyObj.get("value");
		return responseValue;
	}
}
