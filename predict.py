import os
import sys, json
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def read_in():
	lines = sys.stdin.readlines()
	return json.loads(lines[0])


def main():

	lines = read_in()
	args_array = []
	for item in lines:
		args_array.append(item)

	args_array = np.array(args_array).reshape(1,5)
	
	df = pd.DataFrame(args_array, columns = ['zipcode', 'sqft_living', 'bedrooms', 'lat', 'long'])

	path = os.path.join(os.curdir, 'house')
	os.chdir(path)
	file = open('finalized_model.sav', 'rb')
	lr_model = pickle.load(file)
	file.close()

	result = lr_model.predict(df)

	print(-1*result[0])
	sys.stdout.flush()


if __name__ == '__main__':
    main()