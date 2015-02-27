package com.jdpa.graphUtil;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.json.simple.JSONObject;
/**
 * 
 * @author parshuram
 *
 */
public class DataConversion {
	
	public ArrayList sortJsonAsPerKey(JSONObject travesalObject) {
		Set setObject = (Set) travesalObject.keySet();
		SortedSet sortSets = new TreeSet<>(setObject);
		Iterator iteratorObject = sortSets.iterator();
		ArrayList arraylistObject = new ArrayList();
		
		while (iteratorObject.hasNext()) {
			String element = (String) iteratorObject.next();
			arraylistObject.add(element);
		}
		return arraylistObject;
	}

	public String removedTerminatedNode(String text) {
		int index = text.lastIndexOf("-");
		return text.substring(0, index);
	}
	
	public String[] splittingStringByhyphen(String graphPathString) {
		String[] stringArr = graphPathString.split("-");
		return stringArr;
	}
	public String[] splittingStringByColon(String node) {
		String[] stringArr = node.split(":");
		return stringArr;
	}
}
