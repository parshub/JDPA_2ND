package com.jdpa.graphUtil.algorithm;
/**
 * 
 * @author parshuram
 *
 */
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.jdpa.graphUtil.DataConversion;
import com.jdpa.graphUtil.QuestionnaireJsonUtil;

public class GraphAlgorithmUtil {
	QuestionnaireJsonUtil questionnaireJsonUtil = new QuestionnaireJsonUtil();
	DataConversion dataConversion = new DataConversion();
	
	public JSONArray getPossiblePathsBetweenTwoNodes(String currentNode, String nextNode) {
		List<String> listOfResponse = new ArrayList<String>();
		listOfResponse = questionnaireJsonUtil.getListOfResponsesForQuestion(currentNode);
		JSONArray listOfPossiblePathsArray = new JSONArray();
		String path = null;
		
		for (String response : listOfResponse) {
			path = currentNode + ":" + response + "-" + nextNode + ":T";
			listOfPossiblePathsArray.add(path);
		}
		return listOfPossiblePathsArray;
	}

	public JSONArray addToListOfPossiblePathsBetweenTwoNodes(JSONArray prevList, JSONArray currentList) {
		JSONArray resultPathsArr = new JSONArray();
		
		for (int prevNodeResp = 0; prevNodeResp < prevList.size(); prevNodeResp++) {
			for (int nextNodeResp = 0; nextNodeResp < currentList.size(); nextNodeResp++) {
				String prevP = (String) prevList.get(prevNodeResp);
				String currentP = (String) currentList.get(nextNodeResp);
				String newPaths = dataConversion.removedTerminatedNode(prevP)+"-"+currentP;
				resultPathsArr.add(newPaths);
			}
		}
		return resultPathsArr;
	}
	
	public JSONArray getAllPathsForAllNodes(JSONArray listOfIndividualPaths) {
		JSONArray resultedPaths = new JSONArray();
		
		for (int pathIndex = 0; pathIndex < listOfIndividualPaths.size()-1; pathIndex++) {
			if (pathIndex == 0) resultedPaths = (JSONArray) listOfIndividualPaths.get(pathIndex);
			resultedPaths = addToListOfPossiblePathsBetweenTwoNodes(resultedPaths, (JSONArray) listOfIndividualPaths.get(pathIndex+1));
		}
		return resultedPaths;
	}
	
	public JSONArray getAllIndividualPaths() {
		GraphAlgorithmUtil graphAlgorithmUtil = new GraphAlgorithmUtil();
		int noOfQuestionsSize = questionnaireJsonUtil.getLengthOfQuestionsColl();
		List<String> listOfQuestions = questionnaireJsonUtil.getListOfQuestionsFromQnColl();
		JSONArray individualNodesPathList = new JSONArray();
		
		for (int questionIndex = 0; questionIndex < noOfQuestionsSize-1; questionIndex++) {
			String currentNode = listOfQuestions.get(questionIndex);
			String nextNode = listOfQuestions.get(questionIndex+1);
			individualNodesPathList.add(graphAlgorithmUtil.getPossiblePathsBetweenTwoNodes(currentNode, nextNode));
		}
		return individualNodesPathList;
	}
}
