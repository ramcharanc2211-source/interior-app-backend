import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://localhost:5000/api";

  // GET Designers
  static Future<List> getDesigners() async {
    final response = await http.get(Uri.parse("$baseUrl/designers"));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      return [];
    }
  }

  // POST Booking
  static Future<Map?> bookDesigner(String designerId, String date) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/bookings"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "designerId": designerId, // ✅ MUST MATCH BACKEND
          "date": date, // ✅ MUST MATCH BACKEND
        }),
      );

      print(response.body); // 🔍 debug

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return null;
      }
    } catch (e) {
      print(e);
      return null;
    }
  }
}
