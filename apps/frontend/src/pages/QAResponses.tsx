import React from 'react';
import { Accordion, Container } from 'react-bootstrap';

/**
 * QAResponses Component
 * 
 * Renders an accordion containing the theoretical questions and answers
 * for both React and .NET & SQL technical tests.
 * 
 * @returns {React.JSX.Element} The rendered QA Responses view.
 */
const QAResponses: React.FC = () => {
    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Theoretical Questions & Answers</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>React Test</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li><strong>1. What is the error in this useEffect?</strong><br/>Answer C: The dependency array should be []. (Option C is correct because `props.value` was passed directly instead of `[props.value]`).</li>
                            <li><strong>2. What happens with this React state?</strong><br/>Answer B: Both calls use the same previous value, so it only increments once. (State is queued without callback `prev =&gt; prev + 1`).</li>
                            <li><strong>3. Why doesn't this useContext update child components?</strong><br/>Answer C: The cart state is not tied to useState, so changes aren't detected. (React only re-renders if reference/state changes, a constant `[]` won't trigger renders).</li>
                            <li><strong>4. What is the problem with this useEffect?</strong><br/>Answer D: If fetchData depends on props or state, it should be in the dependency array. (exhaust-deps rule).</li>
                            <li><strong>5. What happens with the following useReducer?</strong><br/>Answer B: The state is being mutated directly; it should return a new copy. (`state.count += 1` mutates the original state).</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>.NET & SQL Test</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li><strong>1. What is the result after executing the algorithm?</strong><br/>Answer D: Result 1: 69, Result 2: 49. (Iterates over people, max age is 69 and average is 49).</li>
                            <li><strong>2. Which of the following options shows complete info?</strong><br/>Answer D: a and b are correct. (Both `Console.WriteLine` with `{0}` and concatenation `+` are valid).</li>
                            <li><strong>3. M.V.C Acronym Concept:</strong><br/>Answer A: It is a useful design pattern for presentation components.</li>
                            <li><strong>4. Pattern ensuring a single instance (Singleton):</strong><br/>Answer D: None of the above. (Singleton wasn't explicitly listed).</li>
                            <li><strong>5. O.R.M Definition:</strong><br/>Answer B: A programming technique for converting data between relational databases and object types.</li>
                            <li><strong>6. SQL orders &gt;= 5:</strong><br/>Answer B: Correctly uses `GROUP BY` and then `HAVING COUNT &gt;= 5`.</li>
                            <li><strong>7. Age not between 40 and 50:</strong><br/>Answer D: Uses `NOT BETWEEN (40,50)`.</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default QAResponses;
