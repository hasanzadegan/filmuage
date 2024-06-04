from flask import Flask, jsonify

app = Flask(__name__)

# Sample data
data = [
    {'id': 1, 'name': 'John Doe'},
    {'id': 2, 'name': 'Jane Smith'}
]

# Route for retrieving data by GUID
@app.route('/api/data/guid/<string:data_guid>', methods=['GET'])
def get_data_by_guid(data_guid):
    for item in data:
        if item['guid'] == data_guid:
            return jsonify(item)
    return jsonify({'message': 'Data not found'})

if __name__ == '__main__':
    app.run(debug=True)
