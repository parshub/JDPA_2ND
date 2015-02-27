package com.jdpa.dbUtil;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;

public class DBUtilities {
	static JSONParser parser = new JSONParser();
	static DB dbobject = null;
	MongoClient mongo;
	public DBUtilities() {
		try {
			 mongo = new MongoClient("50.50.50.168", 27017);
			/*dbobject = mongo.getDB("jdpa_new");*/
		} catch (UnknownHostException e) {
			System.out.println("DB Connection Fail");
			e.printStackTrace();
		}
	}

	public void saveData(String dbName ,String collectionName, JSONObject jsonObj) 
	{
		try {
			dbobject = mongo.getDB(dbName);
			DBCollection collection = dbobject.getCollection(collectionName);
			DBObject dbObject = (DBObject) JSON.parse(jsonObj.toJSONString());
			collection.insert(dbObject);
		} catch (MongoException e) {
			e.printStackTrace();
		}

	}

	public JSONObject getJSONObject(String dbName,String collectionName, String internalKey)throws ParseException
	{
		dbobject = mongo.getDB(dbName);
		JSONObject jsonQnData = null;
		DBObject query = new BasicDBObject();
		DBObject field = new BasicDBObject();
		if (internalKey != "") {
			field.put(internalKey, 1);
		}
		field.put("_id", 0);
		try {
			DBCollection collection = dbobject.getCollection(collectionName);
			DBCursor curser = collection.find(query, field);
			String str = curser.next().toString();
			jsonQnData = (JSONObject) parser.parse(str);
			if(jsonQnData.containsKey("Data")){
				jsonQnData = (JSONObject) jsonQnData.get("Data");
			}
		} catch (MongoException e) {
			e.printStackTrace();
		}
		return jsonQnData;
	}


	public List<String> getListOfSurveyNameFormDB(String dbName)
	{
		dbobject = mongo.getDB(dbName);
		Set<String> dbCollections = dbobject.getCollectionNames();
		List<String> questionCollection = new ArrayList<String>();
		for (String collName : dbCollections) 
		{
			if (collName.contains("graph_")	|| collName.contains("system.indexes") || collName.contains("TestSession_") || collName.contains("TestResult_") )
				continue;
			else
				questionCollection.add(collName);
		}
		System.out.println("questionCollection  : "+questionCollection);
		return questionCollection;
	}

	public void updateDBForTestcase(String collectionName, String fileName,JSONObject jsonObj) throws ParseException 
	{
		dbobject = mongo.getDB("JDPA_WEB");
		JSONObject searchData = getJSONObject("JDPA_WEB",collectionName, fileName);
		System.out.println("searchData : "+searchData.get(fileName));
		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.putAll(searchData);
	
		BasicDBObject updateQuery = new BasicDBObject();
		updateQuery.append("$set", new BasicDBObject().append(fileName, jsonObj));
		
		DBCollection collection = dbobject.getCollection(collectionName);
		collection.update(searchQuery,updateQuery);
	}
	
	public void updateDBForQuetionData(String collectionName, String quetionKey, JSONObject jsonObj)
	{
		dbobject = mongo.getDB("JDPA_WEB");
		BasicDBObject updateQuery = new BasicDBObject();
		updateQuery.append("$set", new BasicDBObject().append("Data."+quetionKey, jsonObj.get(quetionKey)));
		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.append("Survey Name", collectionName);
		
		DBCollection collection = dbobject.getCollection(collectionName);
		collection.update(searchQuery,updateQuery,true,true);
	}
	
	 public Set<String> getCollectionNamesFromDB(){
		 	dbobject = mongo.getDB("JDPA_WEB");
	        Set<String> collectionNamesList = dbobject.getCollectionNames();
	        return collectionNamesList;
	    }

}