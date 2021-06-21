import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { useField } from 'react-final-form';
import { TextInput } from 'react-admin';

function loadScript(src, position, id) {
    if (!position) { return; }
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

const ReactAdminGoogleAutocompleteInput = ({ source, label, validate, variant, className, apiKey }) => {
    const {
        input: { name, onChange, value },
        meta: { touched, error }
    } = useField(source);

    const classes = useStyles();
    const [v, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`,
                document.querySelector('head'),
                'google-maps',
            );
        }
        loaded.current = true;
    }

    const fetch = React.useMemo( () => throttle((request, callback) => { autocompleteService.current.getPlacePredictions(request, callback); }, 200), [], );

    React.useEffect(() => {
        let active = true;
        if (!autocompleteService.current && window.google) { autocompleteService.current = new window.google.maps.places.AutocompleteService(); }
        if (!autocompleteService.current) { return undefined; }
        if (inputValue === '') {
            setOptions(v ? [v] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];
                if (v) { newOptions = [v]; }
                if (results) { newOptions = [...newOptions, ...results];}
                setOptions(newOptions);
            }
        });

        return () => { active = false; };
    }, [v, inputValue, fetch]);

    return (
        <Autocomplete
            id="google-map-demo"
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                newValue ? onChange(newValue):onChange('');
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => {
                return (
                    <TextInput
                        {...params}
                        source={source}
                        label={label ? label : source.replace('.', ' ').charAt(0).toUpperCase() + source.replace('.', ' ').slice(1)}
                        validate={validate}
                        variant={variant}
                        className={className}
                        onChange={onChange}
                    />
                )
            }}
            renderOption={(option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(option.structured_formatting.main_text, matches.map((match) => [match.offset, match.offset + match.length]));
                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>{part.text}</span>))}
                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}

export default ReactAdminGoogleAutocompleteInput;
