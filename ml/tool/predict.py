import tensorflow as tf
import json
import numpy as np
from PIL import Image
import os

def resize(img):
    img.thumbnail((96, 64))
    width, height = img.size
    new_img = Image.new("RGB", [96, 64], "white")
    new_img.paste(img, (int((96 - width) / 2), int((64-height)/2)))
    return new_img

def conv2d(x, W):
    return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')


def max_pool_2x2(x):
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                          strides=[1, 2, 2, 1], padding='SAME')


def load_map(mapfile):
    with open(mapfile, 'r') as mfile:
        fish_map = json.load(mfile)
    return fish_map

class NeutralNetwork(object):
    def __init__(self, id_count, save_file):
        self.x = tf.placeholder(tf.float32, [None, 96*64*3], name='x-input')
        self.y_ = tf.placeholder(tf.float32, [None, id_count], name='y-input')
        self.keep_prob = tf.placeholder(tf.float32)

        x_image = tf.reshape(self.x, [-1, 96, 64, 3])

        h_conv1 = self.deep_nn_layer(x_image, [3, 3, 3, 16], [16], tf.nn.relu, conv2d)
        h_pool1 = max_pool_2x2(h_conv1)

        h_conv2 = self.deep_nn_layer(h_pool1, [5, 5, 16, 32], [32], tf.nn.relu, conv2d)
        h_pool2 = max_pool_2x2(h_conv2)
        h_pool2_drop = tf.nn.dropout(h_pool2, self.keep_prob)

        h_conv3 = self.deep_nn_layer(h_pool2_drop, [5, 5, 32, 64], [64], tf.nn.relu, conv2d)
        h_pool3 = max_pool_2x2(h_conv3)

        h_pool3_flat = tf.reshape(h_pool3, [-1, 12 * 8 * 64])

        h_fc = self.deep_nn_layer(h_pool3_flat, [12 * 8 * 64, 512], [512], tf.nn.relu, tf.matmul)
        h_fc_drop = tf.nn.dropout(h_fc, self.keep_prob)

        self.y_conv = self.deep_nn_layer(h_fc_drop, [512, id_count], [id_count], tf.identity, tf.matmul)

        self.sess = tf.InteractiveSession()
        self.saver = tf.train.Saver()
        self.saver.restore(self.sess, save_file)

    def weight_variable(self, shape):
        initial = tf.truncated_normal(shape, stddev=0.1)
        return tf.Variable(initial)

    def bias_variable(self, shape):
        initial = tf.constant(0.1, shape=shape)
        return tf.Variable(initial)

    def deep_nn_layer(self, input_tensor, weight_dim, bias_dim, act, handle):
        weights = self.weight_variable(weight_dim)
        biases = self.bias_variable(bias_dim)
        return act(handle(input_tensor, weights) + biases)

    def predict(self, predict_img):
        res = self.sess.run(self.y_conv, feed_dict={self.x: predict_img, self.keep_prob: 1.0})
        return res[0]

dir_path = os.path.dirname(os.path.realpath(__file__))
fish_group = 0
fish_map = load_map(os.path.join(dir_path, "fishMap" + str(fish_group) + ".json"))
max_id = fish_map["max_id"]
min_id = fish_map["min_id"]
nn = NeutralNetwork(max_id - min_id + 1, os.path.join(dir_path, "Fish" + str(fish_group) + "/fish_conv.ckpt"))

def predict(img_data):
    with Image.open(img_data) as img:
        img = resize(img)
        img = img.convert('RGB')

        img = np.asarray(img, dtype=np.int)
        img = img.reshape([96*64*3, 1])
        final_img = []
        for pixel in img:
            alpha = pixel[0]
            final_img.append((255.0 - alpha) / 255.0)

        predict_res = nn.predict([final_img])
        predict_res_dict = list()
        for i, predict_num in enumerate(predict_res):
            predict_res_dict.append(dict(
                fish_id=str(i),
                predict_num=predict_num
            ))

        predict_res = sorted(predict_res_dict, reverse=True, key=lambda predict: predict['predict_num'])

        final_res = dict()
        i = 0
        for predict in predict_res:
            if i == 3: break
            fish_info = fish_map.get(predict['fish_id'], None)
            fish_info['confidence'] = predict['predict_num'];
            if(fish_info) is not None:
                i += 1
                final_res[i] = fish_info

        if(final_res[3]['confidence'] < 0):
            abs_max_conf = abs(final_res[1]['confidence'])
            abs_min_cong = abs(final_res[3]['confidence'])
            for res in final_res:
                final_res[res]['confidence'] += abs_min_cong + abs_max_conf


        res_sum = final_res[1]['confidence'] + final_res[2]['confidence'] + final_res[3]['confidence']
        for res in final_res:
            final_res[res]['confidence'] = "{0:.2f}".format(final_res[res]['confidence'] / res_sum * 100);

        return final_res


if __name__ == "__main__":
    predict("../static/ml/img/fish3.jpg")
