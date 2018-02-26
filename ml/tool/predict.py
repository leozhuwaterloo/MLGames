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


class NeutralNetwork(object):
    def __init__(self, id_count):
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

    def predict(self, path, test_img):
        sess = tf.InteractiveSession()
        saver = tf.train.Saver()
        saver.restore(sess, path)

        result = tf.argmax(self.y_conv, 1)
        res = sess.run(result, feed_dict={self.x: test_img, self.keep_prob: 1.0})
        sess.close()
        return res[0]

def load_map(mapfile):
    with open(mapfile, 'r') as mfile:
        fish_map = json.load(mfile)

    return fish_map

def predict(img_dir):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    fish_group = 0
    with Image.open(img_dir) as img:
        img = resize(img)
        img = img.convert('RGB')

        img = np.asarray(img, dtype=np.int)
        img = img.reshape([96*64*3, 1])
        final_img = []
        for pixel in img:
            alpha = pixel[0]
            final_img.append((255.0 - alpha) / 255.0)

        fish_map = load_map(os.path.join(dir_path, "fishMap" + str(fish_group) + ".json"))
        max_id = fish_map["max_id"]
        min_id = fish_map["min_id"]
        nn = NeutralNetwork(max_id - min_id + 1)
        fish_id_predict = nn.predict(os.path.join(dir_path, "Fish" + str(fish_group) + "/fish_conv.ckpt"), [final_img])
        fish_info = fish_map.get(str(min_id + fish_id_predict), None)
        print(fish_info)
