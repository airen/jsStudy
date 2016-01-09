# Mixins使用方法

Sass中的mixins默认情况下可以不调用任何参数，此时调用的参数为定义mixins是设置的参数；第二种情形是调用是指定参数。Sass调用mixins都是通过`@include`关键词。

### 1. ellipsis-overflow

#### 功能

字符截取，末尾出现三个`...`。

#### 参数

- `$line`，行数，默认值为`1`。
- `$substract`，指定元素需要去掉的宽度，默认值为`0`。

#### 调用

调用默认参数值，也就是`$line`值为1，`$substract`值为0;

		@include ellipsis-overflow;

指定能数值调用：

		@include ellipsis-overflow(2); // 显示两行文字之后加省略号

#### 示例

SCSS

		.block {
		  @include ellipsis-overflow(20%);
		}

CSS

		.block {
		  overflow: hidden;
		  text-overflow: ellipsis;
		  white-space: nowrap;
		  width: 80%;
		}

### 2. float

#### 功能

设置元素浮动方向。

#### 参数

- `$direction`: 定义浮动方向，默认值为`left`。可选值为`left`、`right`和`none`。
- `$support-for-ie`:布尔值，默认值为`true`。可选值为`true`和`flase`。（如果不需要考虑兼容IE6,可以去掉这个参数）。

#### 调用

默认调用方法：

	@include float;

带参数调用方法：

	@include float(right, false);

#### 示例

SCSS

		.pull-left {
		  @include float(left);
		}
		
		.pull-right {
		  @include float(right,false);
		}

CSS

		.pull-left {
		  float: left;
		  _display: inline;
		}
		
		.pull-right {
		  float: right;
		}

### 3.backgroundTransparent

#### 功能

设置带有透明度的背景颜色。

#### 参数

- `$color`: 背景颜色
- `$opacity`: 透明度
- `$support-for-ie`: 布尔值，默认`false`,如果需要兼容低版本浏览器，只需要将其设置为`true`

#### 调用

默认调用方法：

		@include backgroundTransparent(#000,.5);//颜色和透明度可以根据自己需求定义

带参数调用方法：

		@include backgroundTransparent(#000,.5,true);

#### 示例

SCSS

		.box {
		  @include backgroundTransparent(#000,.5);
		}

CSS

		.box {
		  background-color: rgba(0, 0, 0, 0.5);
		}