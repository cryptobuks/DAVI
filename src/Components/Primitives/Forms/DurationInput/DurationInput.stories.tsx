import { ComponentStory, ComponentMeta } from '@storybook/react';
import DurationInput from './DurationInput';
import { within, fireEvent } from '@storybook/testing-library';
import { useState } from 'react';

export default {
  title: 'DurationInput',
  component: DurationInput,
  argTypes: {
    value: {
      description: 'value',
    },
  },
} as ComponentMeta<typeof DurationInput>;

const StateWrapper = () => {
  const [value, setValue] = useState(0);

  const onChange = e => setValue(e);

  return <DurationInput value={value} onChange={onChange} />;
};

const Template: ComponentStory<typeof DurationInput> = args => {
  return <StateWrapper />;
};

export const Opened = Template.bind({});
Opened.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getItem = () => canvas.findByText('Select a duration');
  const inputItem = await getItem();
  await fireEvent.click(inputItem);
};

export const Closed = Template.bind({});
