package com.jdpa.graph;

import java.io.FileReader;
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.jdpa.graphUtil.DataConversion;
import com.jdpa.graphUtil.QuestionnaireJsonUtil;
import com.jdpa.graphUtil.algorithm.GraphAlgorithmUtil;

/**
 * 
 * @author parshuram
 *
 */

public class TestQuestionAlgorithm {
	JSONArray allTravesalGraphJSONData = new JSONArray();
	DataConversion dataConversion = new com.jdpa.graphUtil.DataConversion();
	QuestionnaireJsonUtil questionnaireJsonUtil = new QuestionnaireJsonUtil();
	final int MIN_NO_OF_QUESTION = 2;
	
	// entry point to generate graph
	public JSONObject generateGraphService(String surveyName) {
		
		
		// read JSON
		QuestionnaireJsonUtil questionnaireJsonUtil = new QuestionnaireJsonUtil();
		questionnaireJsonUtil.readQuestionnaireCollection(surveyName);
		
		int noOfQuestion = questionnaireJsonUtil.getLengthOfQuestionsColl();
		
		// generate path
		GraphAlgorithmUtil graphAlgorithmUtil = new GraphAlgorithmUtil();
		
		// This array is provide the all possible paths between two nodes
		JSONArray allIndividualPathsOfNodes = graphAlgorithmUtil.getAllIndividualPaths();
		
		JSONArray finalAllPathsOfEndToEndNodes = new JSONArray(); 
		if (noOfQuestion > MIN_NO_OF_QUESTION) {
			JSONArray allPathsOfEndToEndNodes = graphAlgorithmUtil.getAllPathsForAllNodes(allIndividualPathsOfNodes);
			finalAllPathsOfEndToEndNodes = allPathsOfEndToEndNodes;
		}else {
			finalAllPathsOfEndToEndNodes = (JSONArray) allIndividualPathsOfNodes.get(0);
		}
		return generateJSONFromString(finalAllPathsOfEndToEndNodes);
	}
	
	
	public JSONObject generateJSONFromString (JSONArray listOfPaths) {
		JSONArray listOfEndToEndPaths = new JSONArray();
		for (int pathIndex=0; pathIndex<listOfPaths.size(); pathIndex++) {
			listOfEndToEndPaths.add(parseStringToJSON((String)listOfPaths.get(pathIndex)));
		}
		JSONObject resultGraphObj = new JSONObject();
		
		for(int indexOfArr = 0;indexOfArr < listOfEndToEndPaths.size();indexOfArr++){
			JSONArray newArr = (JSONArray) listOfEndToEndPaths.get(indexOfArr);
			resultGraphObj.put("TC"+(indexOfArr+1), (JSONObject) newArr.get(0));
		}
		return resultGraphObj;
	}
	
	public JSONArray parseStringToJSON (String path) {
		JSONArray pathSplitByHyphenArr = new JSONArray();
		JSONArray pathSplitByHyphen = (JSONArray)getPathSplitByHyphen(path);
		pathSplitByHyphenArr.add(generateJSON(pathSplitByHyphen));
		return pathSplitByHyphenArr;
	}
	
	// generates final JSON from one of like [[q1,1],[q2,1],[q3,T]]
	public JSONObject generateJSON (JSONArray arrayOfIndividualElementArray) {
		JSONArray testcaseArray = new JSONArray();
		JSONObject testcase = new JSONObject();
		
		for(int arrayIndex = 0; arrayIndex < arrayOfIndividualElementArray.size(); arrayIndex++) {
			String[] currentArr = (String[])arrayOfIndividualElementArray.get(arrayIndex);
			String currentArrFirstIndex = currentArr[0]; 
			String currentArrSecondIndex = currentArr[1];
			
			JSONObject testcaseQuestionValue = new JSONObject();
				
			if(!currentArrSecondIndex.equals("T")) {
				String[] nextArr = (String[])arrayOfIndividualElementArray.get(arrayIndex+1);
				JSONArray nextArrObj = new JSONArray();
				nextArrObj.add(nextArr[0]);
				
				String currentArrSecondIndexText = questionnaireJsonUtil.getValueOfResponseForQuestion(currentArrFirstIndex, currentArrSecondIndex);
				JSONArray respArrObj = new JSONArray();
				respArrObj.add(currentArrSecondIndexText);
				testcaseQuestionValue.put("Response", respArrObj); 
				testcaseQuestionValue.put("Next", nextArrObj); 
				testcase.put(currentArrFirstIndex, testcaseQuestionValue); 
			}else {
				JSONArray nextArrObj = new JSONArray();
				nextArrObj.add("Terminate");
				JSONArray respArrObj = new JSONArray();
				
				testcaseQuestionValue.put("Response", respArrObj);
				testcaseQuestionValue.put("Next", nextArrObj);
				testcase.put(currentArrFirstIndex, testcaseQuestionValue);
			}
		}
		return testcase;
	}

	// splits "Q1:1-Q2:1-Q3:T" into [[Q1:1],[Q2:1],[Q3:T]] and return [[Q1,1],[Q2,1],[Q3,T]] 
	public JSONArray getPathSplitByHyphen (String path) {
		JSONArray listOfArrayOfIndividualElement = new JSONArray();
		String[] questionArr = dataConversion.splittingStringByhyphen(path);

		for (String individualDataFromQuestionArr: questionArr) {
			String[] individualElement = getArrayOfIndividualElement(individualDataFromQuestionArr);
			listOfArrayOfIndividualElement.add(individualElement);
		}
		return listOfArrayOfIndividualElement;
	}
	
	// split Q1:1 into [Q1,1] and return the same 
	public String[] getArrayOfIndividualElement (String individualDataFromQuestionArr) {
		String[] arrayOfIndividualElement = dataConversion.splittingStringByColon(individualDataFromQuestionArr);
		return arrayOfIndividualElement;
	}
}
